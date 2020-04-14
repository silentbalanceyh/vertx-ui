import Cmn from "../fabric.common";
import Ux from "ux";

/**
 * ## 扩展函数「Monad」
 *
 * 传入`event`中的事件队列配置，事件队列中的每一个元素可以生成对应的`DataEvent`，而且按
 * 顺序执行：
 *
 * ```shell
 * DataEvent -> DataEvent -> DataEvent -> ...
 * ```
 *
 * 整个`DataEvent`会按照事件队列依次执行。
 *
 * @memberOf module:_event
 * @method etSequence
 * @async
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Array} event 事件队列
 * @returns {Promise<T>} 返回最终的 Promise
 */
export default (reference, event = []) => {
    /*
     * 按顺序执行，每个元素
     * {
     *      name,
     *      target,
     *      fabric
     * }
     */
    const normalized = [];
    event.filter(item => Ux.isObject(item))
        .forEach(item => {
            const eventData = Ux.clone(item);
            eventData.fnFabric = Cmn.fabricAnalyzer(eventData['fabric']);
            normalized.push(eventData);
        });
    return (dataEvent) => Ux.passion(
        /*
         * 串行执行每一个事件中的 fabric
         */
        normalized.map(item => item.fnFabric(dataEvent.bind(reference).clone(item))),
        /*
         * 开始的 generator 专用参数
         */
        dataEvent,
    ).then(dataEvent => Ux.promise([dataEvent])).then(Cmn.fabricBehavior(reference));
}