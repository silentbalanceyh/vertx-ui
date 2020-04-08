import U from 'underscore';
import Abs from '../abyss';
import Eng from '../engine';
import E from "../error";


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
/**
 * ## 标准函数
 *
 * 还原状态专用函数，还原步骤：
 *
 * 1. 提取reference中的`props`的值`value`。
 * 2. 如果有value则设置`$value`状态信息，如果没有则不执行。
 *
 * @memberOf module:_xt
 * @param {ReactComponent} reference React组件引用。
 */
const xtPrevious = (reference) => {
    const {value} = reference.props;
    if (value) {
        // $开头的变量会被过滤掉
        reference.setState({$value: value});
    }
};
/**
 * ## 标准函数「Ambiguity」
 *
 * 该方法支持两种模式，带`key`参数和不带该参数的模式。
 *
 * ### 带`key`的模式
 *
 * 带key值的模式下，执行步骤如：
 *
 * 1. 从当前引用`ref`的状态中读取`reference`父引用。
 * 2. 从父引用中读取`$_pointer`变量信息。
 * 3. 从该变量中设置`key`为当前引用的 form 变量（绑定Form）实现反向挂载。
 * 4. 并且将该反向挂载的最终数据写入到上层 state 中。
 *
 * ### 不带`key`的模式
 *
 * 这种模式下：
 *
 * 1. 直接提取当前`ref`状态中的 `$_pointer` 变量。
 * 2. 拿到该变量过后，提取父类引用 `reference`。
 * 3. 将该值的 $_pointer 和 $_child 同时更新，实现双向绑定。
 *
 * @deprecated 最早的北二项目使用过的多表单模式才有效，将来可能会废弃。
 * @memberOf module:_xt
 * @param {ReactComponent} ref React组件引用。
 * @param {String} [key] 可选键值。
 */
const xtPointer = (ref, key) => {
    if (key) {
        // 当前组件属性props中的Ant Design的Form引用挂载到父状态的$_pointer中
        const {reference} = ref.props;
        const {$_pointer = {}} = reference.state;
        // 更新form引用需要
        $_pointer[key] = ref.props.form;
        reference.setState({$_pointer});
    } else {
        // 中间节点继续挂载
        const {$_pointer} = ref.state;
        if ($_pointer) {
            const parent = Eng.onReference(ref, 1);
            parent.setState({
                $_pointer, $_child: ref,
            });
        }
    }
};
/**
 * ## 标准函数
 *
 * 在 Zero UI中，以`$`打头的变量名称信息为专用的 Zero UI 属性，这些属性不出现在当前方法结果中，
 * 当前方法中仅包含特殊的值信息，提供给自定义组件。
 *
 * @memberOf module:_xt
 * @param {Object} values 只提取不以`$`开始的变量信息，将该值继承下去。
 * @return {Object} 返回最终的值对象。
 */
const xtToValue = (values = {}) => {
    const filteredValue = {};
    Object.keys(values)
        .filter(key => !key.startsWith("$"))
        .forEach(key => filteredValue[key] = values[key]);
    return filteredValue;
};
const IGNORE_KEYS = Abs.immutable(["reference", "fnOut"]);
/**
 * ## 标准函数
 *
 * 将当前引用中的属性过滤掉一部分，然后执行继承，等价于`valueLimit`和`toLimit`。
 *
 * * reference：当前React组件引用信息。
 * * fnOut：Redux专用的fnOut对应reducer函数。
 *
 * @memberOf module:_xt
 * @param {ReactComponent} reference React组件引用。
 * @return {Object} 返回最终继承对象。
 */
const xtToProp = (reference = {}) => {
    E.fxTerminal(!reference, 10049, reference);
    const result = {};
    Object.keys(reference.props).filter(key => !IGNORE_KEYS.contains(key))
        .forEach(item => result[item] = reference.props[item]);
    return result;
};
export default {
    xtPointer,
    // 同一个界面几次挂载
    xtUnsafe,
    xtGet,
    xtPrevious,

    xtToValue,
    xtToProp
};