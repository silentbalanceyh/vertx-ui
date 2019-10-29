const yiPage = (reference) => {
    const state = {};
    state.$ready = true;
    reference.setState(state);
};
/*
 * 左边树的选择处理
 */
const rxCategory = (reference) => (data) => {

};
export default {
    yiPage,
    rxCategory
}