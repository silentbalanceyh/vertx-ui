import Cmn from "../fabric.common";
import Ux from "ux";

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
    ).then(dataEvent => Ux.promise([dataEvent]))
        .then(Cmn.fabricBehavior(reference));
}