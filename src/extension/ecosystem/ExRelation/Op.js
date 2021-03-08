import Ux from 'ux';
import Ex from "ex";
import Event from './Op.Event';

const itCombine = (reference, executor) => {
    const {config = {}} = reference.props;
    /*
     * 默认为
     * 1）combine = false
     * 2）条件为 !combine
     */
    const {combine = false} = config;
    if (!combine) {
        const relation = Ux.fromHoc(reference, "relation");
        if (relation && relation.combine) {
            executor(relation.combine);
        }
    }
};
const isEditable = (reference) => {
    const {config = {}, current = {}} = reference.props;
    const {editRule = {}} = config;
    // 是否满足编辑规则
    let isEdit;
    if (config.editable) {
        if (Ux.isEmpty(editRule)) {
            // 没有规则
            isEdit = true;
        } else {
            isEdit = Ux.isRule(current, editRule); // 可编辑
        }
    } else {
        isEdit = false; // 不可编辑
    }
    return isEdit;
}

const combineTab = (tabs = {}, reference, data = {}) =>
    itCombine(reference, (config = {}) => {
        const {title, key} = config;
        if (title && key && Ux.isArray(tabs.items)) {
            const tab = {};
            tab.tab = title;
            tab.key = key;
            /*
             * 合并专用窗口
             */
            const {up = [], down = []} = data;
            tab.up = up;
            tab.down = down;
            tab.combine = true;
            tabs.items.push(tab);
        }
    });
const combineRender = (data = {}, reference) => {
    data.render = (text, record = {}) => {
        const field = data['$field'];
        const fieldValue = record[field];
        const {$path = {}} = reference.props;
        if ($path && $path[fieldValue]) {
            return $path[fieldValue];
        } else {
            return false;
        }
    };
    return data;
};
const combineTable = (table = {}, reference, key, combine) =>
    itCombine(reference, (config = {}) => {
        if (combine) {
            const {up = {}, down = {}} = config;
            /*
             * columns 替换
             */
            const added = "up" === key ?
                combineRender(up, reference) :
                combineRender(down, reference);
            if (added) {
                table.columns = Ux.clone(table.columns);
                table.columns.push(added)
            }
        }
    });

const onChange = (reference, key) => (keys = []) => {
    if ("up" === key) {
        reference.setState({$selectedUp: keys});
    } else {
        reference.setState({$selectedDown: keys});
    }
};

const editRow = (reference, key) => {
    const {$selectedUp = [], $selectedDown = []} =
        reference.state ? reference.state : {};
    const attrs = {};
    if ("up" === key) {
        attrs.selectedRowKeys = $selectedUp;
    } else {
        attrs.selectedRowKeys = $selectedDown;
    }
    return {
        onChange: onChange(reference, key),
        ...attrs
    }
};
/*
 * key 表示方向
 */
const editTable = (reference, $table = {}, key, combine) => {
    /*
     * 选择框专用处理
     */
    const {config = {}} = reference.props;
    if (config.editable) {
        $table.rowSelection = editRow(reference, key);
    }
};
const editTab = (reference, tabs = {}) => {
    tabs.onTabClick = (activeKey) => {
        /*
         * 暂时只清除
         */
        let $selectedCategory = [];
        if ("__DELETE__" !== activeKey) {
            $selectedCategory = [activeKey];
        }
        reference.setState({
            $selectedCategory,
            $selectedUp: [],
            $selectedDown: []
        })
    }
};

const yoTabs = (reference) => {
    const {$config = {}, $data = {}} = reference.state;
    const {current, $path = {}} = reference.props;
    /*
     * 数据专用处理
     */
    let {up = [], down = []} = $data;
    const tabs = {items: []};
    /*
     * 关系配置处理
     * 外层 $combine 变量控制
     */
    if (!Ux.isEmpty($path)) {
        let groupedData = {};
        if ($config.hasOwnProperty("relation")) {
            combineTab(tabs, reference, $data);
            const {definition = false} = $config.relation;
            /*
             * 计算不同的 groupData
             * 1）按定义计算
             * 2）按非定义计算
             */
            if (definition) {
                const {$defineArray = []} = reference.state;
                groupedData = Ex.onRelation(current, {
                    up,
                    down
                }, $defineArray);
            } else {
                groupedData = Ex.onRelation(current, {up, down});
            }
            Object.keys(groupedData).sort(Ux.sorterAsc).forEach(identifier => {
                const dataItem = groupedData[identifier];
                if (!Ux.isEmpty(dataItem)) {
                    const tab = {};
                    tab.key = identifier;
                    tab.tab = $path[identifier];
                    tab.up = dataItem.up;
                    tab.down = dataItem.down;
                    tabs.items.push(tab);
                }
            });
        }
        /*
         * 激活专用
         */
        if (0 < tabs.items.length) {
            tabs.defaultActiveKey = tabs.items[0].key;
        }
        tabs.tabPosition = "right";
        tabs.className = "ex-relation-tab";
    }
    editTab(reference, tabs);
    return tabs;
};
const yoTable = (reference, table = {}, key, combine) => {
    const $table = Ux.clone(table);
    const {$renders = {}} = reference.props;
    $table.columns = Ux.configColumn(reference, table.columns, $renders);
    combineTable($table, reference, key, combine);
    // $table.columns.forEach(column => column.width = config.editable ? "25%" : "32%");
    $table.pagination = false;
    $table.className = "web-table ex-relation-table";
    editTable(reference, $table, key, combine);
    if ("up" === key) {
        const {$loadingUp = false} = reference.state;
        $table.loading = $loadingUp;
    } else {
        const {$loadingDown = false} = reference.state;
        $table.loading = $loadingDown;
    }
    return $table;
};
export default {
    ...Event,
    yoTable,
    yoTabs,
    isEditable, // 是否可编辑
}