import {DataLabor} from "entity";

/**
 * 将数据会写状态树，props中需要包含`fnOut`函数
 * @method writeTree
 * @param {ReactComponent} reference React对应组件引用
 * @param state 写入的状态数据
 */
const writeTree = (reference = {}, state) => {
    const {fnOut} = reference.props;
    if (fnOut) {
        fnOut(DataLabor.createIn(state, null));
    } else {
        console.warn("[STATE] 'fnOut' function is missing in current component.", reference);
    }
};
/**
 * @class State
 * @description 回写状态树专用方法
 */
export default {
    writeTree
}
