import __Is from './fn.under.is.decision';
import __Qr from './fn.assemble.element.qr';
import __V from './fn.assort.value.datetime';

const __ambBind = (reference, name, propFirst = true) => {
    const extracted = ambValue(reference, name, propFirst);
    if (__Is.isFunction(extracted)) {
        return extracted;
    }
}
const ambArray = (...args) => {
    let ref;
    if (1 === args.length) {
        if (__Is.isArray(args[0])) {
            ref = args[0];
        } else if (__Is.isObject(args[0])) {
            ref = [args[0]]
        }
    } else {
        if (__Is.isArray(args)) {
            ref = args;
        } else {
            ref = [args];
        }
    }
    return __Is.isArray(ref) ? ref.filter(item => undefined !== item) : [];
}
// --- ambKv ( Iterator )
const _itObject = (object = {}, fnKv) => {
    const ref = object;
    // eslint-disable-next-line
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            const item = object[key];
            ref[key] = ambKv(item, fnKv);
        }
    }
    return ref;
};

const _itArray = (array = [], fnKv) => {
    const result = [];
    array.forEach((each, index) => result[index] = ambKv(each, fnKv));
    return result;
};
const ambKv = (input, fnKv) => {
    if (__Is.isArray(input)) {
        // 如果 $config 是一个 []
        return _itArray(input, fnKv);
    } else if (__Is.isObject(input)) {
        return _itObject(input, fnKv);
    } else {
        return fnKv(input);
    }
}
const ambValue = (reference = {}, name, propFirst = true) => {
    const {props = {}, state = {}} = reference;
    if (propFirst) {
        // 属性优先，其次状态
        if (undefined !== props[name]) {
            return props[name];
        } else {
            return state ? state[name] : null;
        }
    } else {
        // 状态优先，其次属性
        if (state && undefined !== state[name]) {
            return state[name];
        } else {
            return props[name];
        }
    }
};
const ambObject = (reference = {}, name, propFirst = true) => {
    const extracted = ambValue(reference, name, propFirst);
    let values = {};
    if (__Is.isObject(extracted)) {
        Object.assign(values, extracted);
    }
    return values;
};
const ambFind = (props = {}, key, name) => {
    const dataObj = props[key];
    let value;
    if (__Is.isTObject(dataObj)) {
        if (dataObj && dataObj.is()) {
            value = dataObj.find(name);
        }
    } else if (__Is.isObject(dataObj)) {
        if (dataObj && !__Is.isArray(dataObj)) {
            value = __Qr.elementGet(dataObj, name);
        }
    }
    return value;
};
const ambEvent = (event, config = {}, defaultValue) => {
    let value;
    if (event && __Is.isFunction(event.preventDefault)) {
        const {prevent = true, checked = false} = config;
        if (prevent) {
            /*
             * 特殊情况才关闭默认的 preventDefault
             */
            event.preventDefault();
        }
        if (checked) {
            value = event.target['checked'];
        } else {
            value = event.target['value'];
        }
    } else {
        value = event;
    }
    /** 默认值设置 **/
    if (!value && undefined !== defaultValue) {
        value = defaultValue;
    }
    return value;
};
const ambAnnex = (reference = {}, name, propFirst = true) => {
    const props = ambObject(reference, name, true);
    const state = ambObject(reference, name, false);
    const annexValue = {};
    if (propFirst) {
        Object.assign(annexValue, state, props);
    } else {
        Object.assign(annexValue, props, state);
    }
    return annexValue;
}
const ambFn = (reference, name, propFirst = true) => {
    let propsFn = __ambBind(reference, name, true);
    let stateFn = __ambBind(reference, name, false);
    if (propFirst) {
        return __Is.isFunction(propsFn) ? propsFn : stateFn;
    } else {
        return __Is.isFunction(stateFn) ? stateFn : propsFn;
    }
}
const ambDatetime = (input, fields = [], source) => {
    if (!input) {
        return input;
    }
    const $source = source ? source : input;
    fields.forEach(field => {
        if (__Is.isMoment($source[field])) {
            input[field] = $source[field];
        } else {
            input[field] = __V.valueDatetime($source[field]);
        }
    })
    return input;
}
export default {
    ambArray,
    ambKv,
    ambValue,
    ambObject,
    ambFind,
    ambEvent,
    ambDatetime,

    ambAnnex,
    ambFn,
}