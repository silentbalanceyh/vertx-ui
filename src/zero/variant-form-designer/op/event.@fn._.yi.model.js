import Ld from './web.entry';
import dataInit from './event.@fn._.initialize';
import __Zn from '../zero.uca.dependency';

export default (reference, initState = {}) => {
    const {$models = {}, config = {}} = reference.props;
    Ld.yiModel(initState, $models).then((state = {}) => {
        state.raft = dataInit(config);

        __Zn.of(reference).in(state).done();
        // reference.?etState(state);
    })
}