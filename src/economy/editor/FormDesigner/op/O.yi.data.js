import Ux from 'ux';

export default (reference, state = {}) => {
    const {data = {}, $models = {}} = reference.props;
    state.$models = $models;
    state.$modelsAttrs = {};
    return Ux.promise(state);
}