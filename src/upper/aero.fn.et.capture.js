import __FI from './aero.__.fn.fabric.internal';
import Ux from 'ux';

const etPure = (reference, fabric = []) => {
    const fnFabric = __FI.fabricAnalyzer(fabric);
    return async dataEvent => {
        /*
         * 执行结果处理
         * 针对 fabric 中的流程节点执行核心处理，然后跳转到下一步
         * 1）input 类型的需要绑定操作
         */
        return await fnFabric(dataEvent
            .metadata({
                name: "FABRIC" // 内置事件名称，纯事件处理
            })
            .bind(reference))();
    }
}

const etParallel = (reference, event = {}) => {
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
            eventData.fnFabric = __FI.fabricAnalyzer(eventData['fabric']);
            normalized.push(eventData);
        });
    /*
     * 下边是执行区域
     */
    return (dataEvent) => Ux.parallel(
        normalized.map(item => item.fnFabric(dataEvent.bind(reference).clone(item))())
    ).then(__FI.fabricBehavior(reference))
}

const etSequence = (reference, event = []) => {
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
            eventData.fnFabric = __FI.fabricAnalyzer(eventData['fabric']);
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
    ).then(dataEvent => Ux.promise([dataEvent])).then(__FI.fabricBehavior(reference));
}

const etUniform = (reference, event = {}) => {
    /*
     * 为事件做准备，直接处理 event 的配置信息
     * 1）按顺序执行的事件：event 是一个 Array
     * 2）并行执行的事件：event 是一个 Object 并且 key 中不包含 name
     * 3）单独执行的事件：event 是一个 Object 并且 key 中不包含了 name
     */
    if (Ux.isArray(event)) {
        /*
         * 按顺序执行，每个元素
         * {
         *      name,
         *      target,
         *      fabric
         * }
         */
        return etSequence(reference, event);
    } else {
        if (Ux.isObject(event)) {
            /*
             * 并行执行每一个事件中的 fabric
             * 1）input：输入
             * - Object / Array
             * 2）data：对应属性中 props 的 data 节点
             * 多个括号执行一次才能生成真正的promise
             * 规范化事件信息
             */
            return etParallel(reference, event);
        } else {
            throw new Error("[ Ox ] event 配置格式错误")
        }
    }
}
export default {
    etPure,
    etUniform,
    etSequence,
    etParallel,
}