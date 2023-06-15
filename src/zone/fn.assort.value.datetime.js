import __E from './fn.debug.fx.error';
import dayjs from "dayjs";

const valueDatetime = (value, format) => {
    if (value) {
        if (!dayjs.isDayjs(value)) {
            if ("string" === typeof format) {
                value = dayjs(value, format);
            } else {
                value = dayjs(value);
            }
            __E.fxTerminal(!dayjs.isDayjs(value), 10028, value);
        }
        return value;
    } else {
        __E.fxTerminal(true, 10028, value);
    }
};
const valueJDatetime = (data = {}, ...fields) => {
    fields.forEach(field => {
        if (data[field]) data[field] = valueDatetime(data[field]);
    });
};
const valueDuration = (from, to, mode = 'day') => {
    if (from && to) {
        from = valueDatetime(from);
        to = valueDatetime(to);
        return dayjs(to).diff(from, mode);
    } else {
        __E.fxTerminal(true, 10030, from, to, "NoNeed");
    }
};
const valueEndTime = (from, duration, mode = 'day') => {
    if (from && duration) {
        from = valueDatetime(from);
        __E.fxTerminal(duration < 0, 10068, duration);
        return dayjs(from).add(duration, mode);
    } else {
        __E.fxTerminal(true, 10030, from, "NoNeed", duration);
    }
};
const valueStartTime = (to, duration, mode = 'day') => {
    if (to && duration) {
        to = valueDatetime(to);
        __E.fxTerminal(duration < 0, 10068, duration);
        return dayjs(to).subtract(duration, mode);
    } else {
        __E.fxTerminal(true, 10030, "NoNeed", to, duration);
    }
};
const valueNow = (pattern) => {
    if (undefined === pattern) {
        return dayjs();
    } else {
        if (null === pattern) {
            return dayjs().toISOString();
        } else {
            return dayjs().format(pattern);
        }
    }
    // return undefined === pattern ? dayjs() :
    //     (null === pattern ? moment().toISOString() : moment().format(pattern));
};
export default {
    valueDatetime,
    valueJDatetime,

    valueDuration,
    valueStartTime,
    valueEndTime,
    valueNow,
}