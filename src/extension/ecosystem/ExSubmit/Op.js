const yiComponent = (reference) => {
    const state = {};
    state.$ready = true;
    const {$op = {}} = reference.props;
    state.$op = $op;
    reference.setState(state);
}
export default {
    yiComponent
}