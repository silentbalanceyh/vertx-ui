import Ux from 'ux';

export default (reference, state = {}) => {
    const {data = {}, $models = {}} = reference.props;
    state.$models = $models;
    state.$modelsAttrs = {};
    console.info(data);
    return Ux.promise(state);
}