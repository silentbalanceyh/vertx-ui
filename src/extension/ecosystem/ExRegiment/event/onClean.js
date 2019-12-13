import Ux from 'ux';
import T from './O.data';

export default (reference, original = {}) => (event) => {
    Ux.prevent(event);
    const state = {};
    state.$clean = undefined;
    /*
     * 重设成默认的 $query
     */
    const {config = {}} = reference.state;
    state.$query = T.yoQuery(reference, config);
    reference.setState(state);
}