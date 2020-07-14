import Ex from "ex";
import yoPhantom from './yo.phantom';
import Opt from '../options';

const {Order = {}} = Opt;

export default (reference) => {
    const attrs = Ex.yoAction(reference, "op.open", Order);
    /*
     * 清空按钮专用，设置
     * disabled / enabled状态
     */
    let isFiltered = attrs.config.filter(item => "op.open.filter" === item.category);
    if (0 < isFiltered.length) {
        const ref = isFiltered[0];
        if (ref) {
            const {$condition = {}} = reference.state;
            if (0 === Object.keys($condition).length) {
                /*
                 * $condition 无值
                 * 初始态
                 */
                ref.disabled = true;
            } else {
                /*
                 * $condition 中每一个键的搜索长度都为 0
                 * 中间态
                 */
                const counter = Object.keys($condition).map(key => $condition[key])
                    .filter(value => 0 < value.length);
                /*
                 * 状态需要切换
                 */
                ref.disabled = 0 === counter.length;
            }
        }
    }
    /*
     * 挂载 extension 部分
     */
    const extension = yoPhantom(reference, "op.open");
    attrs.config = [].concat(extension).concat(attrs.config);
    return attrs;
}