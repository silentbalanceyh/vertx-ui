import G from "../global";
import Ux from "ux";
import U from 'underscore';

/**
 * ## 扩展函数
 *
 * 删除专用函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxDelete = (reference) => (key, callback) => {
    if (key) {
        const {options = {}, $selected = []} = reference.state;
        const uri = options[G.Opt.AJAX_DELETE_URI];
        return Ux.ajaxDelete(uri, {key})
            .then(() => {
                    const num = $selected.indexOf(key);
                    //删除后从选中项中清除
                    if (-1 !== num) {
                        $selected.splice(num, 1);
                    }
                    //修改状态
                    if (0 === $selected.length) {
                        reference.setState({$selected: []});
                    } else {
                        reference.setState({$selected});
                    }
                    // 删除后续方法
                    const {rxPostDelete} = reference.props;
                    if (U.isFunction(rxPostDelete)) {
                        rxPostDelete({key});
                    }
                    callback(key);
                }
            )
            .catch(error => {
                console.error(error);
                reference.setState({$dirtyAsync: false});
            })
    }
};
/**
 * ## 扩展函数
 *
 * 查询记录专用函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxView = (reference) => (key) => {
    if (key) {
        const {options = {}} = reference.state;
        const uri = options[G.Opt.AJAX_GET_URI];
        return Ux.ajaxGet(uri, {key});
    }
};
/**
 * ## 扩展函数
 *
 * 多选专用函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxSelected = (reference) => ($selected = [], $data = []) => {
    reference.setState({$selected});
    const {rxPostSelected} = reference.props;
    if (Ux.isFunction(rxPostSelected)) {
        rxPostSelected($data);
    }
};
export default {
    rxDelete,
    rxSelected,
    rxView,
}