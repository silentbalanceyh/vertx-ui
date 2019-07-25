import async from './global/async';
import datum from './global/datum';
import action from './form/form.submit';
import form from './form/form';
import funcMap from './func/func.map';
import funcTo from './func/func.to';

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
    /*
     * mapMeta
     * mapUri
     * toUri
     * toDialog
     */
    ...funcMap,
    ...funcTo,
    /*
     * xtParam
     * xtOp
     */
    ...form,
    ...action,
}