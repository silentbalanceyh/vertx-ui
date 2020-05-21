export default (reference) => {
    const state = {};
    state.$ready = true;
    /* 属性数据 */
    const {value} = reference.props;
    const data = [];
    if (value) {
        Object.keys(value).filter(key => value[key])
            .forEach(item => data.push(item));
    }
    state.data = data;
    reference.setState(state);
}