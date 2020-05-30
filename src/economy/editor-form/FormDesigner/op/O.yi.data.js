export default (reference, state = {}) => {
    const {$models = {}, config = {}} = reference.props;
    state.$models = $models;
    state.$modelsAttrs = {};
    state.raft = config;
    reference.setState(state);
}