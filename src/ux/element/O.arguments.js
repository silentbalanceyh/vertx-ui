import U from "underscore";
import {DataObject} from 'entity';
import Abs from '../abyss';

/**
 * ## 标准函数「Ambiguity」
 *
 * 二义性函数数组规范化
 *
 * 1. 如果 args 本身是数组，则直接返回 args，并且过滤掉 undefined 的元素。
 * 2. 如果 args 的第一个元素是数组，则直接返回第一个元素，并且过滤掉 undefined 的元素。
 * 3. 如果 args 不是数组，也不是变参数组，则直接使用 `[]` 修饰过后返回最终数组。
 *
 * 框架内部的使用代码：
 *
 * ```js
 *
 * // 支持三种输入数据格式
 * //     args 变参：("path1","path2");
 * //     args 数组：(["path1","path2"]);
 * //     args 修饰：("path1");
 * const fromPath = (reference = {}, ...args) => {
 *     let keys = Ele.ambArray.apply(this, args);
 *     const length = keys['length'];
 *     // ... 其他代码部分
 * }
 * ```
 *
 * @memberOf module:_ambiguity
 * @param {any[]|Array} args 传入的二义性参数信息
 * @return {Array} 返回最终的数组信息
 */
const ambArray = (...args) => {
    let ref;
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
/**
 * ## 标准函数「Ambiguity」
 *
 * 二义性遍历函数
 *
 * 1. 如果输入的是 Object，则直接遍历，并且传入参数`(key, value)`给 fnKv。
 * 2. 如果输入的的 Array，则遍历每一个 Object 元素，将元素的遍历信息`(key, value)`传入 fnKv。
 *
 * @memberOf module:_ambiguity
 * @param {Object|Array} input 输入的被遍历的源
 * @param {Function} fnKv key=value 的处理函数
 * @return {any} 返回`fnKv`的执行结果
 */
const ambKv = (input, fnKv) => {
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
/**
 * ## 标准函数「Ambiguity」
 *
 * 二义性Event读取专用函数
 *
 * 1. Input触发时，直接从`event.target.value`中读取相关数据。
 * 2. 表单直接触发或Select触发，则`event`就是value，包括`onSearch`，这种情况直接将`event`作为读取值。
 *
 * @memberOf module:_ambiguity
 * @param {Event|Object} event 传入方法和Ant Design中常用的 event 参数`event.target`存在。
 * @param {Object} config 是否启用`prevent`属性，有些特殊情况不能调用`event.preventDefault`，默认关闭。
 * @param {any} defaultValue 默认值，如果没有读取到值则使用默认值
 * @return {any} 返回最终读取到的值。
 */
const ambEvent = (event, config = {}, defaultValue) => {
    let value;
    if (event && U.isFunction(event.preventDefault)) {
        const {prevent = true, checked = false} = config;
        if (prevent) {
            /*
             * 特殊情况才关闭默认的 preventDefault
             */
            event.preventDefault();
        }
        if (checked) {
            value = event.target.checked;
        } else {
            value = event.target.value;
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
/**
 * ## 标准函数「Ambiguity」
 *
 * 二义性数据提取专用函数
 *
 * 1. 传入`key`和`name`，提取属性或状态之下的"对象包含的属性"值。
 * 2. 一级提取：可能返回Object，也可能返回DataObject。
 * 3. 二级提取：任意值。
 *
 * 框架内的使用代码如：
 *
 * ```js
 * const targetKey = attrPath[0];
 * const name = attrPath[1];
 * if (targetKey && name) {
 *     return Ele.ambFind(target, `$${targetKey}`, attrPath[1]);
 * } else {
 *     console.error(`[ Ux ] 解析的配置不对，key = $${targetKey}, name = ${name}`);
 * }
 * ```
 *
 * @memberOf module:_ambiguity
 * @param {Props|State} props 传入的React组件的状态或属性对象
 * @param {String} key 待提取的属性名或状态名称，提取内容必须是一个`Object`或者`DataObject`。
 * @param {String} name 待提取的二级属性名
 * @return {any} 返回最终提取的值。
 */
const ambFind = (props = {}, key, name) => {
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
/**
 * ## 标准函数「Ambiguity」
 *
 * 二义性合并专用函数
 *
 * 1. 直接从 reference 的 props 或 state 中提取属性名为 `name` 的值。
 * 2. 如果无值则直接返回 `{}`。
 *
 * 框架内部代码：
 *
 * ```js
 *
 * const yoHistory = (reference) => {
 *     const $inited = Ux.ambObject(reference, "$inited");
 *     const {activity = {}, changes = []} = $inited;
 *     // 其他处理代码……
 * }
 * ```
 *
 * @memberOf module:_ambiguity
 * @param {ReactComponent} reference React组件引用，通常是reference统一变量名
 * @param {String} name 字符串变量名称，读取变量值专用
 * @return {any} 返回最终的值
 */
const ambObject = (reference = {}, name) => {
    const extracted = ambValue(reference, name);
    let values = {};
    if (Abs.isObject(extracted)) {
        Object.assign(values, extracted);
    }
    return values;
};
/**
 *
 * ## 标准函数「Ambiguity」
 *
 * 二义性专用提取数据函数
 *
 * 1. 先从 `props` 中提取属性为 name 的值。
 * 2. 如果无法从 `props` 中提取，则直接从 `state` 中提取对应的值。
 *
 * 框架内部代码：
 *
 * ```js
 *     const $submitting = Ele.ambValue(reference, "$submitting");
 * ```
 *
 * @memberOf module:_ambiguity
 * @param {ReactComponent} reference React组件引用，通常是reference统一变量名
 * @param {String} name 字符串变量名称，读取变量值专用
 * @return {any} 返回变量对应的值
 */
const ambValue = (reference = {}, name) => {
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
    ambArray,
    /*
     * 二义性遍历，直接提取最终的 key = value
     * 1.如果是 Object，遍历每一对 key = value
     * 2.如果是 Array，先遍历每一个元素，然后 key = value（也就是每个元素中的 key = value）
     * 3.如果 Array 和 Object 相互包含，则递归
     */
    ambKv,
    /*
     * 1.如果 event 是常用的 event.preventDefault 的检查（原生事件），读取 event.target.value
     * 2.如果并不是则直接返回 event
     * 3.如果值不存在，则考虑使用 defaultValue
     */
    ambEvent,
    /*
     * 二义性路径检索
     * 1. 直接读取 props 中，或者 state 中的 key 相关数据
     * 2. 如果读取的数据是 DataObject，则调用 _(name) 读取数据
     * 3. 如果是 Object （非数组），则直接读取 obj[name] 的值
     */
    ambFind,
    /*
     * 二义性读取 对应变量信息
     * 1. 这个方法内置可调用 ambValue
     * 2. 直接提取 props / state 中的name属性
     * 3. 只有 object 类型的数据会返回，否则会返回 {}
     */
    ambObject,
    /*
     * 二义性检索 对应变量信息
     * 1. 这个方法和 ambObject 唯一不同的是，该方法可返回所有类型值
     * 2. 并且只有 undefined 不会返回
     */
    ambValue,
}