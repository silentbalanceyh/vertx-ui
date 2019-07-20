import U from 'underscore';
import Ux from 'ux';

const toArray = (data) => {
    if (data && U.isFunction(data.to)) {
        const $data = data.to();
        if (U.isArray($data)) {
            return $data;
        } else {
            return [];
        }
    } else {
        return [];
    }
};
const toMeta = (data = {}) => {
    if ("string" === typeof data.metadata) {
        data.metadata = Ux.toJson(data.metadata);
    }
    return data;
};
export default {
    toArray,
    toMeta
}