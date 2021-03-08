import Ex from "ex";
import Ux from "ux";
import Plugin from "plugin";
import ExEditorExport from "../ExEditorExport/UI";
import ExEditorBatch from "../ExEditorBatch/UI";
import ExEditorColumn from "../ExEditorColumn/UI";
import ExEditorImport from "../ExEditorImport/UI";
/*
 * 权限控制专用解析
 */
const parseAuthorized = (reference, buttons = {}, options = {}) => {
    // TODO: 权限控制
    /*
     * Open区域
     * Batch区域
     * Search区域
     * Extra区域
     * Row区域
     */
    // console.error(buttons, options);
    return Ux.promise(buttons);
};
/*
 * 事件处理专用解析
 */
const parseEvent = (reference, buttons = {}) => {
    /* 添加页签 */
    if (buttons.hasOwnProperty('op.open.add')) {
        const configRef = buttons['op.open.add'];
        configRef.onClick = Ex.rxTabAdd(reference);
    }
    /* 清除 $condition */
    if (buttons.hasOwnProperty('op.open.filter')) {
        const configRef = buttons['op.open.filter'];
        configRef.onClick = Ex.rxCondition(reference, true);
    }
    /* 批量删除 */
    if (buttons.hasOwnProperty('op.batch.delete')) {
        const configRef = buttons['op.batch.delete'];
        configRef.onClick = Ex.rxBatchDelete(reference);
    }
    return Ux.promise(buttons);
};
const parserOfEvent = (reference) => ({
    parseAuthorized: (buttons = {}, options) => parseAuthorized(reference, buttons, options),
    parseEvent: (buttons = {}, options) => parseEvent(reference, buttons, options)
})
const PluginStd = {
    ExEditorExport,
    ExEditorBatch,
    ExEditorColumn,
    ExEditorImport
}
const asyncOp = (reference, config = {}, state) => {
    const {options = {}, component = {}} = config;
    const eventParser = parserOfEvent(reference);
    const buttonParser = Ex.parserOfButton(reference);
    const pluginComponent = Ux.clone(PluginStd);
    /*
     * 扩展包 Plugin.Extension 中的插件会覆盖标准插件
     */
    Object.keys(Plugin.Extension).filter(field => field.startsWith("Ex"))
        .forEach(field => pluginComponent[field] = Plugin.Extension[field]);
    const $options = Object.assign({}, options, state.options);
    return buttonParser.parseOp(config, $options)
        /* 按钮配置解析 */
        .then((buttons = {}) => buttonParser.parsePlugin(buttons, options))
        /* 组件解析 */
        .then((buttons = {}) => buttonParser.parseComponent(buttons, options, {
            config: component,
            plugin: pluginComponent
        }))
        /* 权限控制统一处理 */
        .then((buttons = {}) => eventParser.parseAuthorized(buttons, options))
        /* 绑定按钮事件 */
        .then((buttons = {}) => eventParser.parseEvent(buttons, options))
}
export default {
    stateTab: (reference, config = {}) => {
        /* 第一个Tab页的初始化 */
        const {options = {}} = config;
        const tab = {};
        tab.tab = options[Ex.Opt.TABS_LIST];
        tab.key = Ux.randomUUID();
        tab.index = 0;
        tab.type = Ex.Mode.LIST;
        tab.closable = false;
        /* Tab 专用初始化 */
        const tabs = {items: [tab]};
        tabs.activeKey = tab.key;
        tabs.type = "editable-card";
        tabs.hideAdd = true;
        /* 统一 */
        tabs.onEdit = (key, action) => {
            if ("remove" === action) {
                /* 关闭 */
                Ex.rxTabClose(reference)(key, {
                    $dirty: true,
                });
            }
        };
        /* Tab 专用风格初始化 */
        const {css = {}} = reference.props;
        const {
            clsTab = Ux.Env.ECONOMY.TAB_CONTAINER
        } = css;
        tabs.className = clsTab;
        /* Tab 函数处理 */
        return tabs;
    },
    stateOption: (reference, config = {}) => {
        const options = Ux.clone(config.options);
        const {rxInject} = reference.props;
        let $options = {};
        if (Ux.isFunction(rxInject)) {
            $options = rxInject(options);
        } else {
            $options = Ux.sorterObject(options);
        }
        return $options;
    },
    stateQuery: (reference, config = {}) => {
        let defaultQuery = {};
        const {$query} = reference.props;
        if (Ux.isEmpty($query)) {
            /*
             * 直接提取 query，query的来源如下：
             * 1）配置中提取 config.query
             * 注：这里的配置来源已经多元化
             * -- config 来源于 Cab.json 中的资源读取（外围读取）
             * -- config 来源于 远程 配置接口
             * 2）直接处理 config.query
             * */
            if (config.query) {
                // cabQuery 不可以在这个组件中调用，因为该组件和 Cab.json 不绑定
                defaultQuery = Ux.qrCombine(config.query, reference);
            }
        } else {
            /*
             * reference.props 中的 $query 优先考虑
             */
            defaultQuery = Ux.clone($query);
        }
        return defaultQuery;
    },
    statePlugin: (reference, config = {}) => {
        /*
         * 读取选项，构造插件
         */
        const {options = {}} = config;
        const plugins = {};
        /*
         * 行过滤专用插件，插件名称
         * pluginRow
         */
        const pluginFn = Ex.sexExPlugin(reference, options, Ex.Opt.PLUGIN_ROW_EDITION);
        if (pluginFn) {
            plugins.pluginRow = pluginFn;
        }
        /*
         * 表单字段专用
         */
        const {pluginField} = reference.props;
        if (Ux.isFunction(pluginField)) {
            const pluginFieldFn = pluginField(reference);
            if (Ux.isFunction(pluginFieldFn)) {
                plugins.pluginField = pluginFieldFn;
            }
        }
        return plugins;
    },
    asyncOp,
    asyncTable: (reference, config = {}, state = {}) => Ux.parallel([
        Ex.rxColumn(reference, {
            ...config,
            columns: config.table ? config.table.columns : []
        })(),
        Ex.rxColumnMy(reference, config)()
    ], "columns", "projections")
        .then(response => {
            /*
             * 启用表达式模式的列处理
             */
            const {columns = []} = response;
            response.columns = Ux.configColumn(reference, columns);
            return Ux.promise(response);
        })
        .then(response => {
            const table = Ux.clone(config.table);
            /*
             * 静态列配置信息
             */
            let staticColumns = [];
            if (table.columns) {
                staticColumns = Ux.clone(table.columns)
            }
            /*
             * 配置 columns
             */
            table.columns = Ex.configColumn(table.columns, response);
            /*
             * 在 state 中引入 全量 / 我的 概念
             * 全列 = 静态列 + 动态列
             * 静态列中主要包含了 Op 的操作列
             */
            state.$columns = Ux.clone(staticColumns.concat(response.columns));
            Object.freeze(state.$columns);
            state.$columnsMy = Ux.clone(table.columns)
                .map(column => column.dataIndex);
            /*
             * Qr 处理，生成 $terms 数据结构
             */
            state.$terms = Ux.qrTerms(table.columns);
            return Ux.promise(table);
        })
        .then(table => {
            /*
             * 额外步骤，检查 search.cond 和 列过滤的冲突
             * searchText 不能命中 列过滤中的 DIRECT 模式
             */
            const {config = {}} = reference.props;
            const {options = {}} = config;
            if (options[Ex.Opt.SEARCH_ENABLED]) {
                /*
                 * 条件过滤
                 */
                const fields = options[Ex.Opt.SEARCH_COND]
                    .filter(condItem => "string" === typeof condItem)
                    .map(condItem => condItem.split(','))
                    .map(condArr => condArr[0])
                    .filter(condItem => !!condItem);
                const prefixes = Object.keys(state.$terms)
                    .filter(key => "STRING" !== state.$terms[key].dataType);
                /*
                 * 计数器
                 */
                const $cond = Ux.immutable(fields);
                prefixes.forEach(prefix => {
                    if ($cond.contains(prefix)) {
                        console.error("[ Ex ] 配置 search.cond 和列过滤冲突！");
                        console.error(" --> search.cond = ", fields, "field = ", prefix);
                    }
                })
            }
            return Ux.promise(table);
        })
}