import Cm from "./gen.common";
import G from "../global";
import Ux from "ux";

/**
 * ## 扩展函数
 *
 * 搜索专用函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxSearch = (reference) => Cm.switcher(reference, 'rxSearch',
    (params) => {
        /*
         * 必须配置 ajax.search.uri
         */
        const {options = {}} = reference.state;
        const uri = options[G.Opt.AJAX_SEARCH_URI];
        return Ux.ajaxPost(uri, params);
    });
/**
 * ## 扩展函数
 *
 * 条件专用函数：清空设置双用
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @param {boolean} isClear 是否清除查询条件
 * @returns {Function} 生成函数
 */
const rxCondition = (reference, isClear = false) => {
    if (isClear) {
        /*
         * 清空列筛选
         */
        return (event) => {
            Ux.prevent(event);
            const {$condition = {}} = reference.state;
            /*
             * 条件本身大于0的时候执行
             */
            if (0 < Object.keys($condition).length) {
                /*
                 * Qr专用清除
                 */
                Ux.qrClear(reference);
            }
        };
    } else {
        /*
         * 设置列筛选
         */
        return ($condition = {}) => reference.setState({
            $condition, // 条件本身：field = value
        })
    }
};
/**
 * ## 扩展函数
 *
 * 基础搜索 / 高级搜索
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxFilter = (reference) =>
    ($filters = {}, $filtersRaw) => {
        const state = {};
        if ($filtersRaw) {
            state['$filtersRaw'] = $filtersRaw;
        }
        state.$filters = $filters;
        reference.setState(state);
    };
export default {
    rxSearch,
    /*
     * 针对列过滤的两种动作（设置/清除）
     * 清空动作：
     * 1）点击：__BTN_CLEAR_<field> 的按钮（列过滤同步）
     * 2）设置：$condition
     * 设置动作：
     * 1）直接设置 $condition
     */
    rxCondition,
    /*
     * 设置 $filters
     * 1）透过表单提交处理 $filters 的最终信息
     * 2）基础搜索 / 高级搜索（共享）
     */
    rxFilter
}