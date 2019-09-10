// 导入自定义核心库
import {Taper} from "environment";
import {Dsl} from "entity";

export default {
    /*
     * Redux专用统一函数
     */
    fnOut: Taper.fnFlush,
    /**
     * Redux专用状态树的写入方法
     * @method dataOut
     * @param data 被写入的数据
     */
    dataOut: (data) => Taper.fnFlush(Dsl.createIn(data)),
    /**
     * Redux专用状态树的读取方法
     * @method dataIn
     * @param state Redux读取到的状态
     */
    dataIn: (state) => Dsl.createOut(state),
    /*
     * 读取 Cab.json 中的配置生成 $hoc
     */
    rxEtat: Dsl.rxEtat,
    /*
     * Stream 模式处理 Redux 初始化过程中的数据读取
     * 1）并且 Ajax
     * 2）串行 Ajax
     * 3）读取 Tabular / Assist / Category
     */
    rxFlow: Dsl.rxFlow,
}