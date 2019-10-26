import Ux from "ux";
import Cmn from "../fabric.common";


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