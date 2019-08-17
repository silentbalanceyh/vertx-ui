import Fn from '../functions';
import U from 'underscore';
import yoAmbient from './yo.ambient';

export default (reference, prefix = "", ordered) => {
    /*
     * 环境数据
     */
    const attrs = yoAmbient(reference);
    /*
     * 配置数据
     */
    const {op = {}} = Fn.state(reference);
    /*
     * 前缀处理
     */
    if (ordered) {
        /*
         * 有序排列
         */
        const buttons = ordered[prefix];
        if (U.isArray(buttons) && 0 < buttons.length) {
            /* 按顺序读取，几个不同区域的配置 */
            attrs.config = buttons.map(key => op[key])
                .filter(item => !!item);
        }
    } else {
        /*
         * 无序排列
         */
        attrs.config = Object.keys(op)
            .filter(opKey => opKey.startsWith(prefix))
            .map(opKey => op[opKey])
            .filter(item => !!item);
    }
    return attrs;    // 去掉 undefined;
}