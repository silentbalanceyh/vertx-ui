import Ld from './library';
import dataInit from './O.fn.data.init';

export default (reference, initState = {}) => {
    const {$models = {}, config = {}} = reference.props;
    Ld.yiModel(initState, $models).then((state = {}) => {
        state.raft = dataInit(config);
        reference.setState(state);
    })
}