import U from 'underscore';
import Ux from 'ux';

const array = (data) => {
    if (data && U.isFunction(data.to)) {
        /*
         * Data Array
         */
        const $data = data.to();
        if (U.isArray($data)) {
            return Ux.clone($data);
        } else {
            return [];
        }
    } else {
        /*
         * JavaScript Array
         */
        if (U.isArray(data)) {
            return Ux.clone(data);
        } else {
            return [];
        }
    }
};
export default {
    array,
}