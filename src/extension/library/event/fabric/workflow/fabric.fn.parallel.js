import Ux from "ux";
import Cmn from "../fabric.common";

/**
 * ## 扩展函数「Monad」
 *
 * 传入`event`是并行事件队列，每个队列中包含不同的 fabric 以及对应被影响的 target 组件信息，每个
 * 处理都是执行的 `DataEvent`。
 *
 * ```shell
 * -> Start -> DataEvent
 *          -> DataEvent
 *          -> DataEvent
 * ```
 *
 * 所有的 `DataEvent` 之间互不影响，会并行执行。
 *
 * @memberOf module:_event
 * @method etParallel
 * @async
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Object} event 并行事件配置
 * @returns {Promise<T>} 返回最终的 Promise
 */
export default (reference, event = {}) => {
    /*
     * event 的数据结构
     * {
     *     <NAME1>: {
     *         fabric: [],
     *         target: "",
     *     },
     *     <NAME2>: {
     *         fabric: [],
     *         target: "",
     *     }
     * }
     */
    const normalized = [];
    Object.keys(event)
        .filter(key => Ux.isObject(event[key]))
        .forEach(key => {
            const eventData = Ux.clone(event[key]);
            eventData.name = key;
            eventData.fnFabric = Cmn.fabricAnalyzer(eventData['fabric']);
            normalized.push(eventData);
        });
    /*
     * 下边是执行区域
     */
    return (dataEvent) => Ux.parallel(
        normalized.map(item => item.fnFabric(dataEvent.bind(reference).clone(item))())
    ).then(Cmn.fabricBehavior(reference))
}