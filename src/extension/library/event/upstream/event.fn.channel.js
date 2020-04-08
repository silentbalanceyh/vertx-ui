import Ux from 'ux';

/**
 * ## 扩展函数
 *
 * `rxChannel` 为顶层穿透函数，主要用于执行 Extension 中 Origin X 引擎专用，在整个 `Ox` 系列的
 * 组件中，组件和组件之间的调用流程使用 Channel 架构，而在 Channel 内部执行事件集合，它可以支持：
 *
 * * 触发事件
 * * 一次事件
 * * 并行事件
 * * 串行事件
 *
 * 组件本身调用其他组件过程时，除了执行内部方法以外，还执行 `rxChannel` 穿透调用。
 *
 * @memberOf module:_rx
 * @method rxChannel
 * @param {ReactComponent} reference React对应组件引用。
 * @returns {Function} 返回 $fabric 专用函数。
 */
export default (reference) => (state = {}) => {
    const {$fabric = {}} = reference.state;
    const fabricNew = Ux.clone($fabric);
    Object.assign(fabricNew, state);
    reference.setState({$fabric: fabricNew});
};