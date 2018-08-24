/**
 * 【高阶函数：三阶】用于显示对话框
 * @method onShow
 * @param execFun 二阶执行函数
 * @param effectKey 效果key
 * @return {function(*=): Function}
 */
const onShow = (execFun, effectKey) => (reference) => (event) => {
    const state = {};
    state[effectKey] = true;
    reference.setState(state);
    if (execFun) {
        execFun(event, reference);
    }
};
/**
 * 【高阶函数：三阶】用于隐藏对话框
 * @method onHide
 * @param execFun 二阶执行函数
 * @param effectKey 效果key
 * @return {function(*=): Function}
 */
const onHide = (execFun, effectKey) => (reference) => (event) => {
    const state = {};
    state[effectKey] = false;
    reference.setState(state);
    if (execFun) {
        execFun(event, reference);
    }
};

const onDialog = (key) => ({
    show: onShow(null, key),
    hide: onHide(null, key)
});

export default {

    // 弹窗专用
    onShow,
    onHide,
    onDialog,
}