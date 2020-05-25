import Ux from 'ux';

export default (reference, state = {}) => {
    const {data = {}, $models = {}} = reference.props;
    console.info(data, $models);
    state.$models = $models;
    state.$modelsAttrs = {};
    return Ux.promise(state);
}