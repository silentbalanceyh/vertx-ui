import Ux from 'ux';
import __V from './pedestal.v.constant.option';
import __Sx from './rapid.fn.sex.ex.action';

const yiListQuery = (reference, query) => {
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
        if (query) {
            // cabQuery 不可以在这个组件中调用，因为该组件和 Cab.json 不绑定
            defaultQuery = Ux.qrCombine(query, reference);
        }
    } else {
        /*
         * reference.props 中的 $query 优先考虑
         */
        defaultQuery = Ux.qrCombine($query, reference);
    }
    return defaultQuery;
}
const yiListSynonym = (reference, config = {}, state = {}) => {
    const {synonym = {}} = config;
    state.$synonym = synonym;
    return Ux.promise(state);
}

const yiListOptions = (reference, config = {}) => {
    const options = Ux.clone(config.options);
    const {rxInject} = reference.props;
    let $options = {};
    if (Ux.isFunction(rxInject)) {
        $options = rxInject(options);
    } else {
        $options = Ux.sorterObject(options);
    }
    return $options;
}

const yiListPlugin = (reference, config = {}) => {
    /*
     * 读取选项，构造插件
     */
    const {options = {}} = config;
    const plugins = {};
    /*
     * 行过滤专用插件，插件名称
     * pluginRow
     */
    const pluginFn = __Sx.sexExPlugin(reference, options, __V.Opt.PLUGIN_ROW_EDITION);
    if (pluginFn) {
        plugins.pluginRow = pluginFn;
    }
    /*
     * 表单字段专用
     */
    const {$plugins = {}} = reference.props;
    if (Ux.isFunction($plugins.pluginFieldFn)) {
        const pluginField = $plugins.pluginFieldFn(reference);
        if (Ux.isFunction(pluginField)) {
            plugins.pluginField = pluginField;
        }
    }
    /*
     * 过滤常用函数
     */
    Object.keys($plugins).filter(key => !__V.PLUGIN.LEGACY.includes(key))
        .forEach(key => plugins[key] = $plugins[key])
    return plugins;
}
const yiColumn = (reference, initState = {}, $data = []) => {
    initState = Ux.clone(initState);
    const {$table} = initState;
    const columns = $table['columns'];
    if (Ux.isArray(columns)) {
        return Ux.ajaxEager(reference, columns, Ux.valueArray($data))
            .then($lazy => Ux.promise(initState, "$lazy", $lazy))
            .then(state => Ux.promise(state, "$data", $data));
    } else {
        console.error("Table columns error: ", $table);
    }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    yiListQuery,
    yiListOptions,
    yiListSynonym,
    yiListPlugin,

    yiListLazy: yiColumn,
    yiColumn,
}