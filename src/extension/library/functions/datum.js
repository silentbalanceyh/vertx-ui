import U from 'underscore';

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
export default {
    toArray
}