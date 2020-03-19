/*
 * 分组处理数据信息
 */
import Ux from "ux";
import Ex from "ex";
import Yo from './yo';

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
            Yo.combineTab(tabs, reference, $data);
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
    Yo.editTab(reference, tabs);
    return tabs;
};
const yoTable = (reference, table = {}, key, combine) => {
    const $table = Ux.clone(table);
    const {$renders = {}} = reference.props;
    $table.columns = Ux.configColumn(reference, table.columns, $renders);
    Yo.combineTable($table, reference, key, combine);
    // $table.columns.forEach(column => column.width = config.editable ? "25%" : "32%");
    $table.pagination = false;
    $table.className = "web-table ex-relation-table";
    Yo.editTable(reference, $table, key, combine);
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
    yoTabs,
    yoTable,
}