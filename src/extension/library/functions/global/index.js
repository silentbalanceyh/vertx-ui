import async from './async';
import datum from './datum';
import Opt from './option';
import Mode from './mode';

export default {
    /*
     * promise(value);
     * promise(supplier, params);
     * promise(state, key, value);
     * failure(reference, error)
     */
    ...async,
    /*
     * array,
     * props,
     * state
     */
    ...datum,
    Opt,
    Mode,
}