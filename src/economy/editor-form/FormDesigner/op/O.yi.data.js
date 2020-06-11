import Ld from './library';
import dataInit from './O.fn.data.init';

export default (reference, initState = {}) => {
    const {$models = {}, config = {}} = reference.props;
    Ld.yiModel(initState, $models).then((state = {}) => {
        const $config = dataInit(config);
        state.raft = $config;
        reference.setState(state);
    })
}