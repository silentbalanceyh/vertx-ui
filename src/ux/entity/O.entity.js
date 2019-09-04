// 导入自定义核心库
import {Taper} from "environment";
import {Dsl} from "entity";

export default {
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
    rxEtat: Dsl.rxEtat,
}