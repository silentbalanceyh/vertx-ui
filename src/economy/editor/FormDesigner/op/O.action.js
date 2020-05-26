import Ux from 'ux';
import Event from './O.event';

const $opSaveLayout = (reference) => (params = {}) => {
    const ref = Ux.onReference(reference, 2);
    Event.raft(ref).onLayout(params);
    reference.setState({$submitting: false, $loading: false});
}
export default {
    $opSaveLayout
}