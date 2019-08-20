import Ux from "ux";

export default (reference = {}, state = {}) => {
    let append = state ? state : {};
    Object.assign(append, {$condition: {}});
    reference.setState(append);

    const {$terms = {}} = reference.state ? reference.state : {};
    Object.keys($terms)
    /* 列筛选必须调用 */
        .map(id => `__BTN_CLEAR_${id}`)
        .forEach(id => Ux.connectId(id))
}