import Ux from "ux";
import moment from "moment";

const toJson = (input) => {
    if ("string" === typeof input) {
        try {
            return JSON.parse(input);
        } catch (e) {
            return null;
        }
    } else return input;
};
/*
 * Moment 专用
 */
const Moment = (input = {}, config = {}) => ({
    to: (...fields) => {
        const $data = Ux.clone(input);
        const format = config.format ? config.format : "YYYY-MM-DDTHH:mm:ss";
        fields.filter(field => !!input[field])
            .filter(field => moment.isMoment(input[field]))
            .forEach(field => $data[field] = input[field].format(format));
        return $data;
    },
    from: (...fields) => {
        const $data = Ux.clone(input);
        const format = config.format ? config.format : "YYYY-MM-DDTHH:mm:ss";
        fields.filter(field => !!input[field])
            .filter(field => "string" === typeof input[field])
            .forEach(field => $data[field] = moment(input[field], format));
        return $data;
    }
});
const toTimeFixed = (momentValue, timeStr) => {
    if (moment.isMoment(momentValue) && "string" === typeof timeStr) {
        /*
         * Time
         */
        const defaultTime = moment(timeStr, "HH:mm:ss");
        if (defaultTime.isValid()) {
            /*
             * Copy hour, min, second
             */
            momentValue.hour(defaultTime.hour());
            momentValue.minute(defaultTime.minute());
            momentValue.second(defaultTime.second());
            return momentValue;
        } else return momentValue;
    } else return momentValue;
};
export default {
    toJson,
    toTimeFixed,
    Moment,
}