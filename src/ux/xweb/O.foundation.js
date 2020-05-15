import U from 'underscore';
import Abs from '../abyss';

/**
 * ## 标准函数
 *
 * 新版中的`UNSAFE_componentWillReceiveProps(nextProps,context)`的内部调用，虽然不提倡使用，
 * 但在自定义组件中，该函数依然会控制内部状态变更，所以依旧采用该方法。
 *
 * @memberOf module:_xt
 * @param {ReactComponent} reference React组件引用。
 * @param {Props} nextProps 下一个属性。
 */
const xtUnsafe = (reference, nextProps = {}) => {
    if ('value' in nextProps) {
        const value = nextProps.value;
        reference.setState(value);
    }
};
/**
 * ## 标准函数
 *
 * 如果`supplier`是函数，则设置状态中的`field`为该函数的执行数据。
 * 如果`supplier`是合法值，则设置状态中的`field`为这个值。
 *
 * @memberOf module:_xt
 * @param {ReactComponent} reference React组件引用。
 * @param {String} field 字段名。
 * @param {Function|any} supplier 读取数据的默认函数。
 * @return {Object} 返回最终状态信息。
 */
const xtGet = (reference, field, supplier) => {
    let state = (reference.state ? reference.state : {});
    if (U.isFunction(supplier)) {
        state[field] = supplier();
    } else {
        if (supplier) {
            state[field] = supplier;
        }
    }
    return Abs.clone(state);
};
export default {
    // 同一个界面几次挂载
    xtUnsafe,
    xtGet,
};