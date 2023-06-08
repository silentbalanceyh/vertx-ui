import dayjs from 'dayjs';
import __Vt from './fn.assort.value.typed';
import __Is from './fn.under.is.decision';
import __A from './fn.atomic.foundation';

const __STDN_CLIENT = {
    BOOLEAN: value => __Vt.valueBoolean(value),
    INTEGER: value => __Vt.valueInt(value, 0),
    FLOAT: value => __Vt.valueFloat(value, 0.0),
    STRING: value => value,
    SELECTOR: value => value,
    TIME: value => value ? dayjs(value, "HH:mm") : null,
    DATETIME: value => value ? dayjs(value) : null,
    DATE: value => value ? dayjs(value) : null,
}
const __STDN_SERVER = {
    BOOLEAN: value => __Vt.valueBoolean(value),
    INTEGER: value => __Vt.valueInt(value, 0),
    FLOAT: value => __Vt.valueFloat(value, 0.0),
    STRING: value => value,
    SELECTOR: value => value,
    TIME: value => dayjs.isDayjs(value) ? value.format("HH:mm:ss") : null,
    DATETIME: value => dayjs.isDayjs(value) ? value.format("YYYY-MM-DD HH:mm:ss") : null,
    DATE: value => dayjs.isDayjs(value) ? value.format("YYYY-MM-DD") : null,
}
const valueT = (value, type = "STRING") => {
    // false, 0 需要使用
    if (undefined !== value) {
        if (["BOOLEAN", "B"].includes(type)) {
            return __STDN_CLIENT.BOOLEAN(value);
        } else if (["INTEGER", "I"].includes(type)) {
            return __STDN_CLIENT.INTEGER(value);
        } else if (["DECIMAL", "D"].includes(type)) {
            return __STDN_CLIENT.FLOAT(value);
        } else {
            return String(value);
        }
    }
}

const valueSTDN = (value = {}, server = false) => {
    const {__metadata = {}, ...data} = value;
    /*
     * Type =
     * - BOOLEAN
     * - INTEGER
     * - FLOAT
     * - SELECTOR
     * - STRING
     * - TIME
     * - DATETIME
     * - DATE
     */
    const values = __A.clone(data);
    Object.keys(__metadata).forEach(field => {
        const type = __metadata[field];
        const executor = server ? __STDN_SERVER[type] : __STDN_CLIENT[type];
        if (__Is.isFunction(executor)) {
            values[field] = executor(data[field]);
        }
    });
    values.__metadata = __metadata;
    Object.keys(data).forEach(field => {
        if (!__metadata.hasOwnProperty(field)) {
            values[field] = data[field];
        }
    })
    return values;
}
export default {
    valueT,
    valueSTDN,
}