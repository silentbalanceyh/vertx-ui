import U from "underscore";
import {DataObject} from 'entity';
import Abs from '../abyss';

const ambiguityArray = (...args) => {
    let ref = null;
    if (1 === args.length && U.isArray(args[0])) {
        ref = args[0];
    } else {
        if (U.isArray(args)) {
            ref = args;
        } else {
            ref = [args];
        }
    }
    return U.isArray(ref) ? ref.filter(item => undefined !== item) : [];
};
/*
 * 二义性遍历
 */
const _itObject = (object = {}, fnKv) => {
    const ref = object;
    // eslint-disable-next-line
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            const item = object[key];
            ref[key] = ambiguityKv(item, fnKv);
        }
    }
    return ref;
};

const _itArray = (array = [], fnKv) => {
    const result = [];
    array.forEach((each, index) => result[index] = ambiguityKv(each, fnKv));
    return result;
};
const ambiguityKv = (input, fnKv) => {
    /*
     * 先判断 Array，因为 Array 调用 isObject 也是 true
     */
    if (U.isArray(input)) {
        // 如果 $config 是一个 []
        return _itArray(input, fnKv);
    } else if (U.isObject(input)) {
        return _itObject(input, fnKv);
    } else {
        return fnKv(input);
    }
};

/*
 * 二义性函数
 * 从 event 中提取数据
 */
const ambiguityEvent = (event, config = {}, defaultValue) => {
    let value;
    if (event && U.isFunction(event.preventDefault)) {
        const {prevent = true} = config;
        if (prevent) {
            /*
             * 特殊情况才关闭默认的 preventDefault
             */
            event.preventDefault();
        }
        value = event.target.value;
    } else {
        value = event;
    }
    /** 默认值设置 **/
    if (!value && undefined !== defaultValue) {
        value = defaultValue;
    }
    return value;
};

const ambiguityFind = (props = {}, key, name) => {
    const dataObj = props[key];
    let value;
    if (dataObj instanceof DataObject) {
        if (dataObj && dataObj.is()) {
            value = dataObj._(name);
        }
    } else if (U.isObject(dataObj)) {
        if (dataObj && !U.isArray(dataObj)) {
            value = dataObj[name];
        }
    }
    return value;
};
/*
 * 默认执行二义性合并
 */
const ambiguityObject = (reference = {}, name, merged = false) => {
    const extracted = ambiguityValue(reference, name);
    let values = {};
    if (Abs.isObject(extracted)) {
        if (merged) {
            Object.assign(values, extracted);
        } else {
            values = extracted;
        }
    }
    return values;
};
const ambiguityValue = (reference = {}, name) => {
    const {props = {}, state = {}} = reference;
    if (undefined !== props[name]) {
        return props[name];
    } else {
        return state[name];
    }
};
export default {
    /*
     * 二义性处理，最终转换成数组
     * 1.变参第一个参数是数组，则转换成数组
     * 2.传入的参数就是数组，则直接转换成数组
     * 3.传入其他的非数组，则直接加上 [] 转换成数组
     */
    ambiguityArray,
    /*
     * 二义性遍历，直接提取最终的 key = value
     * 1.如果是 Object，遍历每一对 key = value
     * 2.如果是 Array，先遍历每一个元素，然后 key = value（也就是每个元素中的 key = value）
     * 3.如果 Array 和 Object 相互包含，则递归
     */
    ambiguityKv,
    /*
     * 1.如果 event 是常用的 event.preventDefault 的检查（原生事件），读取 event.target.value
     * 2.如果并不是则直接返回 event
     * 3.如果值不存在，则考虑使用 defaultValue
     */
    ambiguityEvent,
    /*
     * 二义性路径检索
     * 1. 直接读取 props 中，或者 state 中的 key 相关数据
     * 2. 如果读取的数据是 DataObject，则调用 _(name) 读取数据
     * 3. 如果是 Object （非数组），则直接读取 obj[name] 的值
     */
    ambiguityFind,
    /*
     * 二义性读取 对应变量信息
     * 1. 这个方法内置可调用 ambiguityValue
     * 2. 直接提取 props / state 中的name属性
     * 3. 只有 object 类型的数据会返回，否则会返回 {}
     */
    ambiguityObject,
    /*
     * 二义性检索 对应变量信息
     * 1. 这个方法和 ambiguityObject 唯一不同的是，该方法可返回所有类型值
     * 2. 并且只有 undefined 不会返回
     */
    ambiguityValue,
}