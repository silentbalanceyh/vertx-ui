import Ux from 'ux';
import moment from 'moment';

const toMoment = (input = {}, config = {}, ...fields) => {
    const $data = Ux.clone(input);
    const format = config.format ? config.format : "YYYY-MM-DDTHH:mm:ss";
    fields.filter(field => !!input[field])
        .filter(field => moment.isMoment(input[field]))
        .forEach(field => $data[field] = input[field].format(format));
    return $data;
};
const fromMoment = (input = {}, config = {}, ...fields) => {
    const $data = Ux.clone(input);
    const format = config.format ? config.format : "YYYY-MM-DDTHH:mm:ss";
    fields.filter(field => !!input[field])
        .filter(field => "string" === typeof input[field])
        .forEach(field => $data[field] = moment(input[field], format));
    return $data;
};
export default {
    toMoment,
    fromMoment,
}