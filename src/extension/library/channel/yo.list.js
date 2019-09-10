import yoAmbient from './yo.ambient';
import Fn from '../functions';
import Ux from 'ux';
/*
 * List 必须传入的配置
 * 1）外置：state -> query, 内置：props -> $query
 * 这个会作为默认的 query 值传入，并且会和对应的判断形成呼应
 */
export default (reference) => {
    /*
     * 基本内容
     */
    const inherit = yoAmbient(reference);
    const {
        options = {},   // 当前状态中保存的 options 配置项
        $selected = [], // 内存选中项（多选时使用）
        // 清空时专用
        $condition = {},    // 外置条件保存
    } = reference.state;
    /*
     * 默认的 query 应该走 reference.props 中的
     */
    const {$query} = reference.props;
    let defaultQuery = {};
    if ($query) {
        /*
         * props 属性中的 $query 优先
         */
        defaultQuery = Ux.clone($query);
    } else {
        /*
         * 只有 List组件才会做的事
         */
        const seekQuery = reference.state.query;
        if (seekQuery) {
            defaultQuery = Ux.clone(seekQuery);
        }
    }
    /*
     * 核心业务专用
     */
    Ux.dgQuery(reference, "List组件: $ready = true, yo ( render )");
    inherit.$query = Ux.qrComplex(defaultQuery, reference);
    inherit.$selected = $selected;
    inherit.$options = options;
    inherit.$condition = $condition;
    /*
     * 二义性方法
     * rxSearch
     */
    inherit.rxSearch = Fn.rxSearch(reference);
    /*
     * 条件专用
     * rxCondition
     * rxClean
     */
    inherit.rxCondition = Fn.rxCondition(reference);
    /*
     * 打开新页面
     * rxOpen
     */
    inherit.rxOpen = Fn.rxTabOpen(reference);
    /*
     * 行专用
     * rxSelected
     * rxDeleted
     * rxView
     */
    inherit.rxSelected = Fn.rxSelected(reference);
    inherit.rxDelete = Fn.rxDelete(reference);
    inherit.rxView = Fn.rxView(reference);
    /*
     * 状态函数
     */
    inherit.doLoading = Fn.rxLoading(reference);
    inherit.doDirty = Fn.rxDirty(reference);
    return inherit;
}
