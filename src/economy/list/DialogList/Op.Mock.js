import Ux from "ux";

const updateMonitor = (reference, prevState = {}) => {
    const current = reference.state;
    console.info(current, prevState);
    if (current.view !== prevState.view) {
        // 如果view发生改变，则直接处理
        Ux.D.connectDialog(reference, current);
    } else if (current.key !== prevState.key) {
        // 如果view不改变，只可能在edit中切换
        Ux.D.connectDialog(reference, current);
    }
};

export default {
    updateMonitor
}