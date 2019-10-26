import Cmn from "../fabric.common";

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