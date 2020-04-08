import U from 'underscore';
import Dust from './O.foundation';

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
const xtChange = (reference, changedValues = {}, key) => {
    const {onChange} = reference.props;
    // 10095规范：传入的自定义控件中没有onChange的函数
    E.fxFatal(!U.isFunction(onChange), 10095, onChange);
    // 专用于Array类型的onChange处理，生成新的newValue
    if (key) {
        // Array类型处理变更数据信息
        onChange(changedValues);
    } else {
        // 0.非Array类型
        const $state = Abs.clone(reference.state);
        let newValue = Object.assign({}, $state, changedValues);
        // 1.拷贝新数据
        newValue = Abs.clone(newValue);
        // 2.过滤特殊数据
        newValue = Dust.xtToValue(newValue);
        // 3.变更数据处理
        onChange(newValue);
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
 * @return {Function}
 */
const xt2Change = (reference, field) => (event) => {
    // 1.读取Input数据
    const state = Dust.xtGet(reference, field, () => event.target ? event.target.value : undefined);
    // 2.更新状态
    reference.setState(state);
    // 3.调用内置的onChange专用事件
    xtChange(reference, state);
};
/**
 * ## 标准函数
 *
 * `onBlur`函数触发验证规则，自定义中需要使用时可调用`onBlur`来执行验证。
 *
 * @memberOf module:_xt
 * @param {ReactComponent} reference React组件引用。
 * @param {String} field 待验证的字段名称。
 * @return {Function}
 */
const xt2Blur = (reference, field) => (event) => {
    const {onBlur} = reference.props;
    if (U.isFunction(onBlur)) {
        onBlur(event);
        // 二次绑定处理
        xt2Change(reference, field)(event);
    }
};

export default {
    xtChange,
    // 生成事件
    xt2Change,
    xt2Blur,
};