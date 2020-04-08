import U from 'underscore';
import Abs from '../abyss';
import Immutable from 'immutable';

const element = (input, fnExecute) => {
    if (U.isFunction(fnExecute)) {
        if (U.isArray(input)) {
            // 数组执行每一个元素
            input.forEach((item, index) => {
                if (U.isObject(item)) {
                    fnExecute(item, index);
                }
            });
        } else {
            if (U.isObject(input)) {
                // 非数组执行当前对象
                fnExecute(input);
            }
        }
    }
};
/**
 * ## 标准函数「Ambiguity」
 *
 * 针对原始数据进行子集计算，值保留存在数据中的元素信息，使用`attr`构造每一个元素的子集。
 *
 * ### fnExecute
 *
 * | 参数名 | 类型 | 说明 |
 * |:--- |:---|:---|
 * | item | 元素信息 | 数组中则是元素信息，对象则是对象本身。 |
 * | index | 索引信息 | 数组可用，索引信息。|
 *
 * @memberOf module:_primary
 * @param {Object|Array} input 遍历对象数组，执行元素。
 * @param {String[]} attr 属性集合数据。
 */
const cut = (input, ...attr) => {
    const target = Abs.clone(input);
    const fnCut = (item = {}) => attr.filter(field => item.hasOwnProperty(field))
        .forEach(field => delete item[field]);
    element(target, fnCut);
};
/**
 * ## 标准函数「Ambiguity」
 *
 * 双遍历函数
 *
 * 1. 如果传入是 Object，则执行 key, value, object的数据。
 * 2. 如果传入是 Array，则执行 item, index, array的数据。
 *
 * > 统一遍历处理。
 *
 * @memberOf module:_primary
 * @param {Object|Array} input 遍历数据的源头。
 * @param {Function} fnExecute 执行函数。
 */
const each = (input, fnExecute) => {
    if (input) {
        if (U.isArray(input)) {
            input.forEach((item, index) => fnExecute(item, index, input));
        } else if (U.isObject(input)) {
            // eslint-disable-next-line
            for (const key in input) {
                if (input.hasOwnProperty(key)) {
                    fnExecute(key, input[key], input);
                }
            }
        }
    }
};
/**
 *
 * ## 标准函数「Ambiguity」
 *
 * 全遍历专用做法，内部调用`itFull`函数，从上层遍历到下层。
 *
 * @memberOf module:_primary
 * @param {Array} array 传入的数据源信息。
 * @param {Object} object 传入的对象信息。
 * @param fnExecute 执行函数
 * @param fnPredicate 验证函数（验证通过才执行）。
 */
const matrix = (array = [], object = {}, fnExecute, fnPredicate) => {
    if (!Abs.isEmpty(object)) {
        // 是否检查
        const predicate = U.isFunction(fnPredicate) ? fnPredicate : () => true;
        Abs.itFull(array, object, (item = {}, key, value) => {
            if (predicate(value)) {
                fnExecute(item, key, value);
            }
        });
    }
};
/**
 * ## 标准函数
 *
 * 展开对象专用函数，将传入对象直接展开，生成新对象，支持下边几种模式：
 *
 * 1. overwrite 为 true，使用转换过后的数据重写传入数据。
 * 2. overwrite 为 false，使用传入数据重写转换国恒的数据。
 *
 * 执行`mapping`转换，针对from和to的核心映射操作。
 *
 * @memberOf module:_primary
 * @param {Object} item 传入对象。
 * @param {Object} mapping 映射配置信息。
 * @param {boolean} overwrite 是否重写。
 * @return {Object} 返回展开过后的对象。
 */
const expand = (item = {}, mapping = {}, overwrite = false) => {
    const object = {};
    Abs.itObject(mapping, (from, to) => {
        // 如果item包含了右边，则直接左边的值的等于右边
        if (item.hasOwnProperty(to)) {
            object[from] = item[to];
        } else if (item.hasOwnProperty(from)) {
            object[to] = item[from];
        }
    });
    return overwrite ? Object.assign(item, object) :
        Object.assign(object, item);
};
const to = (value) => {
    if (value) {
        if (U.isFunction(value)) {
            const result = value();
            return result ? result : {};
        } else {
            return value;
        }
    } else return {};
};
/**
 * ## 标准函数「Ambiguity」
 *
 * 1. 如果不传入 value 则调用获取方法。
 * 2. 如果传入 value 则调用设置方法。
 * 3. `name`可以包含`.`操作符，形成多级路径。
 * 4. instance 可以是普通的Object，也可以是`Immutable.fromJS`生成的特殊Map对象。
 *
 * @memberOf module:_primary
 * @param {Object} instance 被解析的实例对象，数据从该对象中提取。
 * @param {String} name 被提取的字段名称。
 * @param {any|Function} value 解析的最终数据，如果是Function则直接执行函数读取值。
 * @return {*}
 */
const field = (instance, name, value) => {
    if (instance && "string" === typeof name) {
        let $instance = Immutable.fromJS(instance);
        // 如果value为undefined（2参数，读取）
        if (value) {
            // 【二义性处理】Function和值
            value = to(value);
            if (0 <= name.indexOf('.')) {
                const path = name.split('.');
                $instance = $instance.setIn(path, value);
            } else {
                $instance = $instance.set(name, value);
            }
        } else {
            if (0 <= name.indexOf('.')) {
                const path = name.split('.');
                $instance = $instance.getIn(path);
            } else {
                $instance = $instance.get(name);
            }
        }
        // 返回读取的最终结果
        return U.isFunction($instance.toJS) ? $instance.toJS() : $instance;
    }
};
export default {
    each,
    cut,
    matrix,
    expand,
    field,
}