import Ux from 'ux';
import __V from './pedestal.v.constant.option';
import __RX from './idyl.zero.dependency';
import __CG from './habit.fn.config.control';

const __yiColumn = (parameters = {}) => {
    const {
        reference, config = {}, state
    } = parameters;
    return response => {
        /*
         * 启用表达式模式的列处理
         */
        const {columns = []} = response;
        response.columns = Ux.configColumn(reference, columns);
        return Ux.promise(response).then(response => {
            const table = Ux.clone(config.table);
            /*
             * 静态列配置信息
             */
            let staticColumns = [];
            if (table.columns) {
                staticColumns = Ux.configColumn(reference, table.columns);
            }
            /*
             * 配置 columns
             */
            table.columns = __CG.configColumn(staticColumns, response);
            /*
             * 在 state 中引入 全量 / 我的 概念
             * 全列 = 静态列 + 动态列
             * 静态列中主要包含了 Op 的操作列
             */
            state.$columns = Ux.elementConcat(staticColumns, response.columns, 'dataIndex')
            //Ux.clone(staticColumns.concat(response.columns));
            Object.freeze(state.$columns);
            state.$columnsMy = Ux.clone(table.columns)
                .map(column => column.dataIndex);
            /*
             * Qr 处理，生成 $terms 数据结构
             */
            state.$terms = Ux.qrTerms(table.columns);
            return Ux.promise(table);
        }).then(table => {
            /*
             * 额外步骤，检查 search.cond 和 列过滤的冲突
             * searchText 不能命中 列过滤中的 DIRECT 模式
             */
            const {options = {}} = config;
            if (options[__V.Opt.SEARCH_ENABLED]) {
                /*
                 * 条件过滤
                 */
                const fields = options[__V.Opt.SEARCH_COND]
                    .filter(condItem => "string" === typeof condItem)
                    .map(condItem => condItem.split(','))
                    .map(condArr => condArr[0])
                    .filter(condItem => !!condItem);
                const prefixes = Object.keys(state.$terms)
                    .filter(key => "STRING" !== state.$terms[key].dataType);
                /*
                 * 计数器
                 */
                prefixes.forEach(prefix => {
                    if (fields.includes(prefix)) {
                        console.error("[ Ex ] 配置 search.cond 和列过滤冲突！");
                        console.error(" --> search.cond = ", fields, "field = ", prefix);
                    }
                })
            }
            table.className = Ux.Env.ECONOMY.TABLE_CONTROL;
            return Ux.promise(table);
        }).catch(error => {
            console.error(error)
        });
    }
}
const yiListTable = (reference, config = {}, state = {}) => {
    const response = {};
    return __RX.rxColumn(reference, {
        ...config,
        columns: config.table ? config.table.columns : []
    })().then(columns => Ux.promise(response, 'columns', columns))
        .then(() => __RX.rxColumnMy(reference, config)())
        .then(projections => Ux.promise(response, 'projections', projections))
        .then(__yiColumn({reference, config, state}));
    // return Ux.parallel([
    //     __RX.rxColumn(reference, {
    //         ...config,
    //         columns: config.table ? config.table.columns : []
    //     })(),
    //     __RX.rxColumnMy(reference, config)()
    // ], "columns", "projections").then(__yiColumn({
    //     reference, config, state,
    // }))
}
const yiListView = (reference, config = {}, state = {}) => {
    return __RX.rxColumnMy(reference, config)().then(projections => {
        const {$columns = []} = reference.state;
        const response = {
            projections,
            columns: $columns,
        }
        return Ux.promise(response);
    }).then(__yiColumn({
        reference, config, state,
    }));
}

const yiListTab = (reference, config = {}) => {
    /* 第一个Tab页的初始化 */
    const {options = {}} = config;
    const tab = {};
    tab.tab = options[__V.Opt.TABS_LIST];
    tab.key = Ux.randomUUID();
    tab.index = 0;
    tab.type = __V.Mode.LIST;
    tab.closable = false;
    /* Tab 专用初始化 */
    const tabs = {items: [tab]};
    tabs.activeKey = tab.key;
    // 列表页类型
    if (options[__V.Opt.TABS_TYPE]) {
        tabs.type = options[__V.Opt.TABS_TYPE];
    } else {
        tabs.type = "editable-card";
    }
    tabs.hideAdd = true;
    /* 统一 */
    tabs.onEdit = (key, action) => {
        if ("remove" === action) {
            /* 关闭 */
            __RX.rxTabClose(reference)(key, {
                $loading: true,
            });
        }
    };
    /* Tab 专用风格初始化 */
    const {css = {}} = reference.props;
    const {
        clsTab = Ux.Env.ECONOMY.TAB_CONTAINER
    } = css;
    // ux_tab
    let combineCls = clsTab;
    if (options[__V.Opt.TABS_CONTAINER]) {
        // ux_tab_container
        combineCls += ` ${clsTab}_container`
    }
    if (options[__V.Opt.TABS_TITLE]) {
        // ux_tab_title
        combineCls += ` ${clsTab}_title`
    }
    tabs.className = combineCls;
    /* Tab 函数处理 */
    return tabs;
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    yiListTab,
    yiListView,
    yiListTable,
}