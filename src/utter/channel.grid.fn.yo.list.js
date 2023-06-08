import Ux from 'ux';
import yoAmbient from './channel.@fn.yo.ambient';
import __V from './pedestal.v.constant.option';

// const __isBatchEnabled = (reference) => {
//     const {op = {}} = reference.state;
//     let counter = 0;
//     Object.keys(op).forEach(opKey => {
//         if (opKey.startsWith('op.batch')) {
//             counter += 1;
//         } else if (opKey.startsWith("op.extension")) {
//             const button = op[opKey];
//             const region = button.region ? button.region : "";
//             if (region.startsWith("op.batch")) {
//                 // Skip the config component
//                 if (button.component) {
//                     if (!["RADIO"].includes(button.component)) {
//                         counter += 1;
//                     }
//                 } else {
//                     counter += 1;
//                 }
//             }
//         }
//     });
//     return 0 < counter;
// };
const yoPolymorphism = (reference = {}, {form}) => {
    const attrs = yoAmbient(reference);
    /*
     * 配置 config 相关信息构成多态，直接从 grid 中读
     */
    let config = Ux.fromHoc(reference, "grid");
    if (config) {
        /*
         * 通过拷贝检查最终的 config 发生改变
         * 这里必须使用拷贝以方便切换，如果不拷贝那么切换会导致最终的
         * 界面不刷新（动态切换必须在这里处理）
         */
        attrs.config = Ux.clone(config);
    } else {
        config = {};
    }
    /*
     * 专用组件信息
     * 用于配置 $form 专用组件
     */
    if (form) {
        attrs.$form = form;
    }
    /*
     * $query 中的 this.state
     */
    const {$query = {}} = reference.state ? reference.state : {};
    attrs.$query = $query;
    /*
     * options = {}
     */
    const {options = {}} = config;
    if (options[__V.Opt.IDENTIFIER]) {
        attrs.$identifier = options[__V.Opt.IDENTIFIER];
    }
    return attrs;
}

const yoGrid = (reference) => {
    /*
     * _grid:
     * {
     *     "options": "选项",
     *     "query": "查询参数",
     *     "table": "表格"
     * }
     * config:
     * {
     *     "options": {}
     * }
     */
    const hocConfig = Ux.fromHoc(reference, "grid");
    const $config = Ux.clone(hocConfig);
    const {config = {}} = reference.props;
    if (config.options) {
        Object.assign($config.options, config.options);
    }
    return $config;
}
//
// const yoList = (reference) => {
//     /*
//      * 基本内容
//      */
//     const inherit = yoAmbient(reference);
//     const {
//         options = {},   // 当前状态中保存的 options 配置项
//         $selected = [], // 内存选中项（多选时使用）
//         // 清空时专用
//         $condition = {},    // 外置条件保存
//     } = reference.state;
//     inherit.$query = Ux.qrInherit(reference);
//     inherit.$selected = $selected;
//     inherit.$options = options;
//     inherit.$condition = $condition;    // 主要是为了维持状态专用
//     /*
//      * 二义性方法
//      * rxSearch
//      */
//     inherit.rxSearch = Fn.rxSearch(reference);
//     /*
//      * 条件专用
//      * rxCondition
//      * rxClean
//      */
//     // inherit.?xCondition = Fn.?xCondition(reference);
//     /*
//      * 打开新页面
//      * rxOpen
//      */
//     inherit.rxOpen = Fn.rxTabOpen(reference);
//     /*
//      * 行专用
//      * rxSelected
//      * rxDeleted
//      * rxView
//      */
//     inherit.rxSelected = Fn.rxSelected(reference);
//     inherit.rxDelete = Fn.rxDelete(reference);
//     inherit.rxView = Fn.rxView(reference);
//     /*
//      * rxPost系列
//      */
//     inherit.rxPostDelete = Ux.fn(reference).rxPostDelete;
//     return inherit;
// }
//
// const yoTable = (reference) => {
//     const inherit = yoList(reference);
//     /*
//      * 配置数据
//      */
//     const state = reference.state;
//     const {table = {}, $terms = {}} = state;
//     inherit.config = table;
//     /*
//      * 是否支持批量
//      */
//     const {plugins = {}} = reference.state;
//     inherit.$batch = __isBatchEnabled(reference);
//     inherit.$plugins = plugins;
//     /*
//      * $executor 函数专用（不能漏掉该函数）
//      */
//     const {$executor, $renders} = reference.props;
//     if ($executor) {
//         inherit.$executor = $executor;          // 操作按钮专用
//     }
//     if ($renders) {
//         inherit.$renders = $renders;            // 列渲染执行专用
//     }
//     /*
//      * 是否 dirty
//      */
//     const {$dirty = false, $loading = false, $dirtyAsync = false} = state;
//     inherit.$dirty = $dirty;
//     inherit.$loading = $loading;
//     inherit.$dirtyAsync = $dirtyAsync;
//     /*
//      * 列过滤信息
//      */
//     inherit.$terms = $terms;
//     return inherit;
// }
export default {
    yoPolymorphism,     // Grid ( Dynamic )
    yoGrid,             // Grid ( Static )
}