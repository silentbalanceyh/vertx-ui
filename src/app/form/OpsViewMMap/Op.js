const yiInit = (reference) => {
    const state = {};
    state.$ready = true;
    reference.setState(state);
}
export default {
    yiInit
}