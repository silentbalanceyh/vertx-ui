import U from 'underscore';
import Ux from 'ux';

const array = (data) => {
    if (data && U.isFunction(data.to)) {
        const $data = data.to();
        if (U.isArray($data)) {
            return Ux.clone($data);
        } else {
            return [];
        }
    } else {
        return [];
    }
};
const props = (reference) => reference.props ? reference.props : {};
const state = (reference) => reference.state ? reference.state : {};
export default {
    array,
    props,
    state,
}