import U from 'underscore';
import Value from '../Ux.Value';

/**
 * 创建不可变对象
 * @param values
 * @param key
 */
const remove = (values = {}, key = "") => {
    if (U.isObject(values) && "string" === typeof key) {
        delete values[key];
    }
    return Value.clone(values);
};
export default {
    remove
}