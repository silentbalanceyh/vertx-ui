import Ux from "ux";

const updateMonitor = (reference, prevState = {}) => {
    const current = reference.state;
    // 窗口打开时处理
    if (current.show && !prevState.show) {
        // 如果view发生改变，则直接处理
        Ux.D.connectDialog(reference, current);
    }
};

export default {
    updateMonitor
}