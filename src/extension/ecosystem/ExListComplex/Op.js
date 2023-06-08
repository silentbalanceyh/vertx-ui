import Ux from 'ux';
import Ex from 'ex';
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
const __componentState = (reference, config = {}) => {
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
    const $query = Ex.yiListQuery(reference, config.query);
    // eslint-disable-next-line no-lone-blocks
    {
        /*
         * $queryDefault / 配置和传入
         * $queryView    / 视图追加
         * -- 1. 第一次：Search 之后使用 __qr 更新（没有 $qr 时追加）
         * -- 2. 保存列、查询条件、我的视图管理之后更新，保证和下一次刷新读取 __qr 一致
         * -- 3. 每次搜索计算搜索起点从 $query 开始计算
         * $query        / 直接提取
         */
        // 新版追加
        state.$queryDefault = Ux.clone($query);
        state.$queryView = Ux.clone($query);
        state.$query = Ux.clone($query);
        state.$loading = true;
        state.$submitting = false;
    }
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
    return state;
    // return Ux.promise(state);
};


const __verifyNode = (config = {}) => {
    // 解决 Bug: Cannot read property 'query' of null
    if (!config) config = {};
    /* SPC-01.1: config 中必须包含 query 节点 */
    if (!config.query) return Ux.E.fxMessage(10009, 'config', 'query');
    /* SPC-01.2: config 中的 query 必须是 Object */
    if (!Ux.isObject(config.query)) return Ux.E.fxMessage(10010, 'config.query', 'Array');
    /* SPC-01.3: config 中必须包含 options 节点 */
    if (!config.options) return Ux.E.fxMessage(10009, 'config', 'options');
    /* SPC-01.4: config 中的 options 必须是 Object */
    if (!Ux.isObject(config.options)) return Ux.E.fxMessage(10010, 'config.options', 'Object');
    /* SPC-01.5: config 中必须包含 component */
    if (!config.component) return Ux.E.fxMessage(10009, 'config', 'component');
    /* SPC-01.6: config 中的 component 必须是 Object */
    if (!Ux.isObject(config.component)) return Ux.E.fxMessage(10010, 'config.component', 'Object');
    /* SPC-01.7: config 中比比包含 table */
    if (!config.table) return Ux.E.fxMessage(10009, 'config', 'table');
    /* SPC-01.8: config 中的 table 必须是 Object */
    if (!Ux.isObject(config.table)) return Ux.E.fxMessage(10010, 'config.table', 'Object');
}
const __verifyQuery = (config = {}) => {
    const query = config.query;
    /* SPC-02.1: config.query 中必须包含 projection 节点 */
    if (!query.projection) return Ux.E.fxMessage(10009, 'config.query', 'projection');
    /* SPC-02.2: config.query.projection 必须是 Array */
    if (!Ux.isArray(query.projection)) return Ux.E.fxMessage(10010, 'config.query.projection', 'Array');
    /* SPC-02.3: config.query 中必须包含 pager 节点 */
    if (!query.pager) return Ux.E.fxMessage(10009, 'config.query', 'pager');
    /* SPC-02.4: config.query 中必须包含 sorter 节点 */
    if (!query.sorter) return Ux.E.fxMessage(10009, 'config.query', 'sorter');
    /* SPC-02.5: config.query 中碧玺包含 criteria 节点 */
    if (!query.criteria) return Ux.E.fxMessage(10009, 'config.query', 'criteria');
}
const __verifyComponent = (reference, config = {}) => {
    let error = __verifyNode(config);                 /* SPC-01 检查 */
    if (!error) error = __verifyQuery(config);        /* SPC-02 检查 */
    return error;
};
const componentState = (reference) => {
    const {config = {}, /* 基本配置 */} = reference.props;
    const error = __verifyComponent(reference, config);         /* W01: 验证生成 error */
    if (error) {
        return ({error});                                       /* ERROR: 有错误的页面 */
    } else {
        const initState = __componentState(reference, config);
        return {
            // $loading: false,        // 数据加载
            // $submitting: false,     // 表单提交
            ...initState,
            $ready: false,
            /*
             * 列表状态和值
             */
            $view: "list",         // 当前列表类型
            $key: undefined,       // 默认无（第一次会初始化）

            // =========================== 新版核心变量
            /*
             * $condition 会在触发时生成
             * $qr 统一使用后端语法
             * $terms 在 initState 中已经包含
             */
            $qr: {
                connector: "AND"        // 对标 "":true
            },
            $myView: {
                name: "DEFAULT"         // 视图信息 —— 个人视图
            }
        }
    }
}
const __componentInit = (reference, initState = {}) => {
    const {config = {}} = reference.props;
    return Ex.yiListOp(reference, {
        ...config,
        pluginComponent,
        pluginExtension
    }, initState)
        .then(op => Ux.promise(initState, 'op', op))
        /* 动态列 */
        .then(() => Ex.yiListTable(reference, config, initState))
        .then(table => Ux.promise(initState, '$table', table))
        .then(synonym => Ex.yiListSynonym(reference, config, synonym))
    /* 数据和 $lazy 处理表格列 */
    // .then(state => Ex.kinDoSearch(reference, state));
}

const componentInit = (reference) => {
    /* 动态OP */
    const state = reference.state ? reference.state : {};
    return __componentInit(reference, state);
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    componentState,
    // sync,
    componentInit,
    // 二段执行
    componentAtom: (reference) => {
        const state = componentState(reference);
        return __componentInit(reference, state);
    }
}