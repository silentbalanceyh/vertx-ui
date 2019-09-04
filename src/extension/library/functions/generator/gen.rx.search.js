import Cm from "./gen.common";
import G from "../global";
import Ux from "ux";
import Qr from '../../query';

const rxSearch = (reference) => Cm.switcher(reference, 'rxSearch',
    (params) => {
        /*
         * 必须配置 ajax.search.uri
         */
        const {options = {}} = reference.state;
        const uri = options[G.Opt.AJAX_SEARCH_URI];
        return Ux.ajaxPost(uri, params);
    });
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
                Qr.qrClear(reference);
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
const rxFilter = (reference) =>
    ($filters = {}) => reference.setState({
        $filters,       // 该条件也会在合并中出现
    });
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