import Ux from 'ux';
import Ex from "ex";
import ExEditorExport from "../ExEditorExport/UI";
import ExEditorBatch from "../ExEditorBatch/UI";
import ExEditorColumn from "../ExEditorColumn/UI";
import ExEditorImport from "../ExEditorImport/UI";
import ExEditorView from "../ExEditorView/UI";
import pluginExtension from "plugin";

const pluginComponent = {
    ExEditorExport,
    ExEditorBatch,
    ExEditorColumn,
    ExEditorImport,
    ExEditorView
}
/*
 * 基本配置解析
 * 1. query：（静态默认的query）；
 * 2. options：（选项处理）；
 * 3. mock：模拟数据；
 * 4. component：子组件；
 * 5. table：列表表格配置；
 */
const sync = (reference, config = {}) => {
    const state = {};
    {
        /*
         * 禁止选项专用，禁止掉 config 中的多余选项，保证最终信息
         */
        const {$forbidden = {}} = reference.props;
        if (!Ux.isEmpty($forbidden) && config.options) {
            /*
             * 旧代码：config = Ux.clone(config)
             * *：不可以拷贝，需要删除原始配置中的 options
             */
            Object.keys($forbidden).forEach(optKey => {
                if (!$forbidden[optKey] && config.options.hasOwnProperty(optKey)) {
                    delete config.options[optKey];
                }
            })
        }
    }
    /*
     * 存储 options 到状态中（以后每次从 options 中读取）
     * 1. options中的配置比较多，需要单独提取
     * 2. options拷贝一份，会被 rxInject 处理
     */
    state.options = Ex.yiListOptions(reference, config);
    /*
     * query 状态保存，根容器中保存了 query 的相关状态
     * 1. 如果外置 $query 传入，那么也会更新 query
     * 2. query 合并过后执行 update 方法，然后将 query 最终传入 Table 组件
     * 3. 当前组件：state -> query 会转换成 props -> $query 转换最终查询条件给 Table 组件
     */
    state.query = Ex.yiListQuery(reference, config.query);
    /*
     * 准备 Tabs 的初始化状态
     * 1. 打开 Tab
     * 2. 关闭 Tab
     */
    state.tabs = Ex.yiListTab(reference, config);
    /*
     *  activeKey 中的值拷贝到 $key 中，构造核心视图数据
     * 1) 列表：view = list, key = activeKey
     * 2) 添加页：view = add, key = ( new Key )
     * 3) 编辑页：view = edit, key = activeKey
     * */
    state.$key = state.tabs.activeKey;
    /*
     * 准备 Table 表格专用状态
     * 1. 解析核心状态
     * 2. 静态或动态解析 列专用
     * 由于包含了列信息，所以改成异步
     */
    // state.table = stateTable(reference, config);
    state.plugins = Ex.yiListPlugin(reference, config);
    /*
     * 提交和加载
     */
    return Ux.promise(state);
};
const async = (reference, config = {}, state = {}) =>
    /* 动态OP */
    Ex.yiListOp(reference, {
        ...config,
        pluginExtension,
        pluginComponent
    }, state)
        .then(op => Ux.promise(state, 'op', op))
        /* 动态列 */
        .then(() => Ex.yiListTable(reference, config, state))
        .then(table => Ux.promise(state, 'table', table));

const ready = (reference = {}, state = {}) => {
    state.$ready = true;    // 只有 $ready 是单独控制
    return Ux.promise(state);
};
export default {
    sync,
    async,
    ready,
}