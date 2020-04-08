import Ux from 'ux'
import Event from '../event';

export default (reference, item = {}) => (event) => {
    Ux.prevent(event);
    const state = Event.ciMove(reference, item);
    reference.setState(state);
}