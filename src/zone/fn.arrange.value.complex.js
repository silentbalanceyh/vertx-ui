import __Is from './fn.under.is.decision';
import __It from './fn.under.it.spread';
import __A from './fn.atomic.foundation';
import __Amb from './fn.assemble.amb.polysemy';

const valueValid = (data = {}, wild = false) => {
    // eslint-disable-next-line
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            if (__Is.isArray(value)) {
                value.forEach(item => valueValid(item, wild));
            } else if (__Is.isObject(value)) {
                valueValid(value, wild);
            } else {
                if (wild) {
                    // 空字符串、0，以及其他值
                    if (!value) {
                        delete data[key];
                    }
                } else {
                    if (undefined === value) {
                        delete data[key];
                    }
                }
            }
        }
    }
    return data;
};
const valueCopy = (target = {}, source = {}, field) => {
    if (field) {
        if ("string" === typeof field) {
            if (source[field]) {
                if (__Is.isObject(source[field])) {
                    target[field] = __A.clone(source[field]);
                } else if (__Is.isArray(source[field])) {
                    target[field] = __A.clone(source[field]);
                } else {
                    target[field] = source[field];
                }
            }
        } else if (__Is.isArray(field)) {
            field.forEach(eachField => valueCopy(target, source, eachField));
        }
    }
    return target;
};

const valueOk = (input = {}, config = [], output) => {
    const values = {};
    config.forEach(field => {
        if (0 < field.indexOf(',')) {
            // field,to
            const kv = field.split(',');
            values[kv[0]] = input[kv[1]];
        } else if (0 < field.indexOf("=")) {
            // field=to
            const kv = field.split('=');
            if ("false" === kv[1]) {
                values[kv[0]] = false;
            } else if ("true" === kv[1]) {
                values[kv[0]] = true;
            } else {
                values[kv[0]] = kv[1];
            }
        } else {
            // field
            values[field] = input[field];
        }
    });
    if (output) {
        Object.assign(output, values);
    }
    return values;
}
const valueAppend = (item = {}, field = "", value) => {
    if (!item.hasOwnProperty(field)) {
        item[field] = value;
    }
};
const valueFind = (target = {}, attrPath = []) => {
    if (2 <= attrPath.length) {
        const targetKey = attrPath[0];
        const path = __A.clone(attrPath);
        const name = path.splice(0, 1);
        if (targetKey && 0 < path.length) {
            return __Amb.ambFind(target, `$${targetKey}`, path);
        } else {
            console.error(`[ Ux ] 解析的配置不对，key = $${targetKey}, name = ${name}`);
        }
    } else {
        if (1 === attrPath.length) {
            /*
             * 长度为1，直接提取
             */
            const targetKey = attrPath[0];
            return target[targetKey];
        } else {
            console.error(`[ Ux ] 解析表达式有问题，请检查：$${target}`);
        }
    }
};
const valueLink = (from = {}, to = {}, vConn = false) => {
    const result = {};
    Object.keys(from).forEach(field => {
        if (vConn) {
            const fromKey = field;
            const toKey = from[field];
            result[fromKey] = to[toKey];
        } else {
            const fromKey = from[field];
            result[fromKey] = to[field];
        }
    })
    return result;
}
const valueMap = (target, source, config = {}) => {
    __It.itObject(config, (from, to) => {
        if (!target[from]) {
            target[from] = source[to];
        }
    });
    return target;
}
export default {
    valueAppend,
    valueCopy,
    valueFind,
    valueLink,
    valueMap,
    valueOk,
    valueValid,
}