import U from 'underscore';

import E from '../error';
import Abs from '../abyss';

/**
 * ## 标准函数
 *
 * 自定义函数专用的 onChange 统一更新值的核心函数。
 *
 * @memberOf module:_xt
 * @param {ReactComponent} reference React组件引用。
 * @param {Object} changedValues 改变过后的状态信息，改变状态必须是`Object`类型。
 * @param {key} key 如果存在该值，则表示数组类型或基础类型的处理，直接更新，不计算。
 */
const xtChange = (reference, changedValues, key) => {
    const {onChange} = reference.props;
    // 10095规范：传入的自定义控件中没有onChange的函数
    // 这里不可以使用 U.isFunction 检查，因为 onChange 是 native code
    if (!U.isFunction(onChange)) {
        E.fxFatal(10095, onChange);
    }
    if (changedValues) {
        const $state = Abs.clone(reference.state ? reference.state : {});
        let updatedState = $state;
        if (key) {
            /*
             * 有 key 值（第二路径做法）
             */
            const data = $state[key];
            const merged = Abs.merge(data, changedValues);
            onChange(merged);
            updatedState[key] = merged;
        } else {
            /*
             * 无 key 值，直接以状态为主
             */
            const merged = Abs.merge($state, changedValues);
            onChange(merged);
            Object.assign(updatedState, merged);
        }
        return updatedState;
    }
};
/**
 * ## 标准函数「2阶」
 *
 * 核心变更函数，二阶，生成onChange专用，内部调用被绑定的`onChange`方法，以及更改状态，修正 Ant Design 的 form 内部状态。
 *
 * @memberOf module:_xt
 * @param {ReactComponent} reference React组件引用。
 * @param {String} field 待验证的字段名称。
 * @param {String} key 状态中专用的键值
 * @return {Function}
 */
const xt2Change = (reference, field, key = "data") => (event) => {

};

export default {
    // 生成事件
    xtChange,
    // xt2Change,
    // xt2Blur,
};