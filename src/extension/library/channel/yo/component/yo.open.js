import yoExtension from './yo.extension';
import yoAction from '../yo.action';

import {Order} from './I.list.options';

export default (reference) => {
    const attrs = yoAction(reference, "op.open", Order);
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
    // const extension = yoExtension(reference, "op.open");
    // attrs.config = [].concat(extension).concat(attrs.config);
    attrs.config = yoExtension(reference, "op.open", attrs.config);
    return attrs;
}