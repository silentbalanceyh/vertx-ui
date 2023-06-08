import Ux from "ux";
import EVENT from './ego.__.v.kin.event.names';

/**
 * ## 「标准」`Ex.kinTRow`
 *
 * @method kinTRow
 * @memberOf module:kin/unfold
 * @param reference
 * @param row
 * @return {*}
 */
export default (reference, row = {}) => (record) => {
    const result = {};
    const events = Ux.configExecutor(reference, EVENT);
    Ux.itObject(row, (event, target) => {
        const executor = events[target];
        if (Ux.isFunction(executor)) {
            result[event] = event => {
                Ux.prevent(event);
                executor(record.key, record, {
                    config: Ux.clone(row),
                    reference
                });
            }
        }
    });
    return result;
}