import React from 'react';
import Ex from 'ex';
import renderJsx from './Web.jsx';
import Ux from "ux";
import Op from "./Op";

/**
 * ## 「组件」`ExListQuery`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * ### 2. 核心
 *
 * React属性props:
 *
 * ```js
 * {
 *      $app: DataObject - X_APP 应用程序数据,
 *      $router: DataRouter - （react-router）构造对象,
 *      $user: DataArray - 登录的用户基本数据,
 *      fnOut: 专用 redux 写树函数,
 *      config:{
 *          query: （静态默认 query，主要包含四个键：projection, pager, sorter, criteria）,
 *          options: （选项处理）,
 *          mock: {},
 *          component: {},
 *          table: {}
 *      },
 *      $query：从外层传入的查询条件
 *
 *      rxInject: 注入函数用于修改 options（工具专用）
 *      rxSearch: 函数用于调用搜索方法，传入参数
 * }
 * ```
 *
 * React状态state:
 *
 * ```js
 * {
 *      options: （原始选项）
 *      query：（核心query）
 *      $submitting: 提交
 *      $loading：加载
 * }
 * ```
 *
 * 步骤处理：
 * 0. Verify, ./specification/verify.js
 * 1. Init, ./specification/workflow.js
 *
 * @memberOf module:web-component
 * @method ExListQuery
 */
// =====================================================
// componentInit/componentUp
// =====================================================

const verifyNode = (config = {}) => {
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
const verifyQuery = (config = {}) => {
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

const verifyComponent = (reference, config = {}) => {
    let error = verifyNode(config);                 /* SPC-01 检查 */
    if (!error) error = verifyQuery(config);        /* SPC-02 检查 */
    return error;
};

const componentInit = (reference) => {
    const {config = {}, /* 基本配置 */} = reference.props;
    const error = verifyComponent(reference, config);    /* W01: 验证生成 error */
    if (error) {
        return Ux.promise({error});                     /* ERROR: 有错误的页面 */
    } else {
        return Op.sync(reference, config)                         /* W02: 静态状态，来源 config */
            .then(state => Op.async(reference, config, state))    /* W03: 动态状态，来源 远程或其他 */
            .then(state => Op.ready(reference, state));           /* W04: 处理准备状态 */
    }
};
const componentUp = (reference, previous = {}) => {
    /*
     * 默认 $query 变量的修改（外置传入）
     */
    const prevProps = previous.prevProps;
    const props = reference.props;
    /*
     * 配置优先考虑
     */
    const $configChecked = Ex.upList(props, prevProps);
    if ($configChecked) {
        /*
         * 默认的 配置处理
         */
        reference.setState({$ready: false});
        Ux.toLoading(() => componentInit(reference)
            .then(state => reference.setState(Ux.clone(state))))
    } else {
        const $queryChecked = Ex.upQuery(props, prevProps);
        if ($queryChecked) {
            /*
             * 修改当前记录中的 query
             * 由于 $query 变量发生了改变，所以
             * 1）$selected 变量清空
             */
            const updatedState = {};
            updatedState.query = Ux.clone($queryChecked.current);
            updatedState.$selected = [];
            reference.setState(updatedState);
        }
    }
};

class Component extends React.PureComponent {
    state = {
        // $loading: false,        // 数据加载
        // $submitting: false,     // 表单提交
        $ready: false,
        /*
         * 列表状态和值
         */
        $view: "list",         // 当前列表类型
        $key: undefined,       // 默认无（第一次会初始化）
        /*
         * 底层 Table 选中项
         */
        $selected: [],         // 底层选中项
        $condition: {},        // 条件设置项，默认 Object
        /*
         * 当前组件需要生成的 fn函数集
         */
    };

    componentDidMount() {
        componentInit(this)/* Promise处理 */
            .then(state => this.setState(state));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentUp(this, {prevProps, prevState});
    }

    render() {
        return Ex.yoRender(this, () => {
            const {tabs = {}} = this.state;
            /*
             * 当前组件不调用 ExTab 来处理 Tab
             * 页签行为，而是直接使用 antd 中的 Tabs，主要是防止和原始的
             * ComplexList / ExListComplex 产生冲突
             */
            return renderJsx(this, tabs);
        }, Ex.parserOfColor("ExListQuery").list())
    }
}

export default Component;