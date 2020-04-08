import Cmn from "../fabric.common";

/**
 *
 * ## 扩展函数「Monad」
 *
 * 生成带`DataEvent`参数的专用函数，事件处理专用，处理纯事件执行，使用内置事件名称：
 *
 * * 内置事件：`FABRIC`（纯事件）
 *
 * @memberOf module:_event
 * @method etPure
 * @async
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Array} fabric 处理 fabric 数组配置。
 * @returns {Promise<T>} 返回执行的 Promise
 */
export default (reference, fabric = []) => {
    const fnFabric = Cmn.fabricAnalyzer(fabric);
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