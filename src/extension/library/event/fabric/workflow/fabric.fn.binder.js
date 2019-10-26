import U from 'underscore';
import Ux from 'ux';
import fabricSequence from './fabric.fn.sequence';
import fabricParallel from './fabric.fn.parallel';

export default (reference, event = {}) => {
    /*
     * 为事件做准备，直接处理 event 的配置信息
     * 1）按顺序执行的事件：event 是一个 Array
     * 2）并行执行的事件：event 是一个 Object 并且 key 中不包含 name
     * 3）单独执行的事件：event 是一个 Object 并且 key 中不包含了 name
     */
    if (U.isArray(event)) {
        /*
         * 按顺序执行，每个元素
         * {
         *      name,
         *      target,
         *      fabric
         * }
         */
        return fabricSequence(reference, event);
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
            return fabricParallel(reference, event);
        } else {
            throw new Error("[ Ox ] event 配置格式错误")
        }
    }
}