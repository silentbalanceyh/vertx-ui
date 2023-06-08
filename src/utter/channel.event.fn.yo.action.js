import Ux from 'ux';
import yoAmbient from './channel.@fn.yo.ambient';

const yoAction = (reference, prefix = "", ordered) => {
    /*
     * 环境数据
     */
    const attrs = yoAmbient(reference);
    /*
     * 配置数据
     */
    const {op = {}} = reference.state;
    /*
     * 前缀处理
     */
    if (ordered) {
        /*
         * 有序排列
         */
        const buttons = ordered[prefix];
        if (Ux.isArray(buttons) && 0 < buttons.length) {
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

const yoExtension = (reference, prefix, actions = []) => {
    const source = Ux.clone(actions);
    const {op = {}} = reference.state;
    const {rxExtension = () => true} = reference.props;
    const targets = Object.keys(op)
        .filter(key => key.startsWith("op.extension"))
        .filter(key => !!op[key])
        .filter(key => !!op[key].region)
        .filter(key => op[key].region.startsWith(prefix))
        /* 默认直接返回 true，表示所有的条件都符合 */
        .filter(key => rxExtension(op[key], reference))
        .map(key => {
            const normalized = op[key];
            normalized.key = op[key].region;
            return normalized;
        });
    /*
     * 修改 source 最终返回
     * 如果没有 index，则元素追加到后边
     * 基本算法：
     * source = [0,1,2,3]
     * targets 分成两部分，带 index 的，不带 index 的
     */
    const fnIndex = (item = {}) => {
        const {config} = item;
        return config && config.hasOwnProperty('index')
    }
    const tail = targets
        .filter(item => !fnIndex(item));
    const inserted = targets
        .filter(item => fnIndex(item))
        .sort((left, right) => left.config.index - right.config.index);
    let append = [];
    if (0 < inserted.length) {
        const found = inserted[inserted.length - 1];
        const maxIndex = found.config.index;
        source.reverse();
        /*
         * 补充 inserted
         * [1,3] -> [undefined, 1, undefined, 3]
         */
        const filled = [];
        for (let idx = 0; idx <= maxIndex; idx++) {
            const found = inserted.filter(item => idx === item.config.index);
            if (found[0]) {
                filled.push(found[0]);
            } else {
                filled.push(null);
            }
        }
        /*
         * 填充 null 替换成 source 中的值
         */
        filled.forEach((fill) => {
            if (fill) {
                append.push(fill);
            } else {
                if (0 < source.length) {
                    append.push(source.pop())
                }
            }
        });
        /*
         * source 结束的
         */
        if (0 < source.length) {
            source.forEach(item => append.push(item))
        }
        append = append.filter(item => !!item);
    } else {
        // 没有 inserted
        append = [].concat(source).concat(tail);
    }
    return append;
}
export default {
    yoAction,
    yoExtension,
}