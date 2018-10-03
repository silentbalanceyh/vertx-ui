import Ux from "ux";


const monitorDialogList = (reference, prevState = {}) => {
    const current = reference.state;
    // 窗口打开时处理
    if (current.show && !prevState.show) {
        // 如果view发生改变，则直接处理
        Ux.D.connectDialog(reference, current);
    }
};
const monitorComplexList = (reference, prevState = {}) => {
    const current = reference.state;
    if (current.view !== prevState.view) {
        // 如果view发生改变，则直接处理
        Ux.D.connectMajor(reference, current);
    } else if (current.key !== prevState.key) {
        // 如果view不改变，只可能在edit中切换
        Ux.D.connectMajor(reference, current);
    }
};
export default {
    monitorDialogList,
    monitorComplexList
};