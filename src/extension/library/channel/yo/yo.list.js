import yoAmbient from './yo.ambient';
import Fn from '../../functions';
import Ux from 'ux';
import U from 'underscore';

/**
 * ## 扩展函数
 *
 * List 必须传入的配置
 *
 * 1. 外置：state -> query, 内置：props -> $query
 * 2. 这个会作为默认的 query 值传入，并且会和对应的判断形成呼应
 *
 *
 * @memberOf module:_channel
 * @method yoList
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Object} 计算最终生成的继承属性专用方法
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
    inherit.$query = Ux.qrInherit(reference);
    inherit.$selected = $selected;
    inherit.$options = options;
    inherit.$condition = $condition;    // 主要是为了维持状态专用
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
    /*
     * rxPostDelete处理
     */
    const {rxPostDelete} = reference.props;
    if (U.isFunction(rxPostDelete)) {
        inherit.rxPostDelete = rxPostDelete;
    }
    /*
     * rxPost系列
     */
    return inherit;
}
