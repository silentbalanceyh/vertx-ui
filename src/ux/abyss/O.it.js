import U from 'underscore';
import E from '../error';
import V from './O.immutable';
import Is from './O.is';

/**
 * ## 标准函数「Twins」
 *
 * 遍历二维数组
 *
 * 1. 如果元素是 Array，则 eachFun 作用于每一个 Object 类型的元素。
 * 2. 如果元素是 Object，则 eachFun 直接作用于这个 Object。
 * 3. 会一直递归调用到最下层。
 *
 * ```js
 * const matrix = [
 *      [
 *          { name: "name1", age: "age1" },
 *          { name: "name2", age: "age2" }
 *      ],
 *      { name: "name3", age: "age3" }
 * ]
 *
 * Ux.itMatrix(matrix, (item) => {
 *      console.info(item.name);
 * });
 * // 上述代码会依次打印：name1, name2, name3
 * ```
 *
 * @memberOf module:_it
 * @param {Array<Array<T>|Object>} matrix 二维表矩阵数据
 * @param {Function} eachFun 作用于每一个元素的单子函数
 * @return {Array<T>} 返回 matrix 本身
 */
const itMatrix = (matrix = [], eachFun) => {
    matrix.forEach(row => {
        if (U.isArray(row)) {
            row.forEach(item => eachFun(item));
        } else {
            eachFun(row);
        }
    });
    return matrix;
};
/**
 * ## 标准函数
 *
 * 对象遍历函数，直接遍历 Object 对象，生成 `key = value` 的执行函数专用。
 *
 * ```js
 * const user = {
 *     username: "Lang",
 *     email: "lang.yu@hpe.com"
 * }
 * Ut.itObject(user, (key, value) => {
 *
 *     // 此处的 key, value 对应
 *     // 1. username = Lang
 *     // 2. email = lang.yu@hpe.com
 * });
 * ```
 *
 * @memberOf module:_it
 * @param {Object} data 将会被遍历的 Object 对象
 * @param {Function} executor 作用于 `key, value` 的执行函数
 * @param {boolean} invalid `value`非法的时候是否执行`executor`函数
 */
const itObject = (data = {}, executor = () => {
}, invalid = false) => {
    const iterator = V.clone(data);
    // eslint-disable-next-line
    for (const key in iterator) {
        if (iterator.hasOwnProperty(key) &&
            data.hasOwnProperty(key)) {
            const value = data[key];
            if (invalid) {
                executor(key, value);
            } else {
                /*
                 * false / null / 0 都属于业务边界值
                 */
                if (undefined !== value) {
                    executor(key, value);
                }
            }
        }
    }
};
/**
 * ## 特殊函数
 *
 * 表单 form 中的配置 `ui` 的专用遍历函数，会生成带坐标的二维矩阵。
 *
 * 该函数主要用于表单解析中，解析 `ui` 的专用函数，这里不提供示例代码，主要解析结构，如配置项为：
 *
 * ```json
 * {
 *     "_form": {
 *         "ui": [
 *             [
 *                 "name,用户名"
 *             ],
 *             [
 *                 "email,邮箱",
 *                 {
 *                     "field": "age",
 *                     "optionItem.label": "年龄"
 *                 }
 *             ]
 *         ]
 *     }
 * }
 * ```
 *
 * 解析过后的最终数据结构如：
 *
 * ```shell
 * name 字段，位于：      ui[0][0]。
 * email 字段，位于：     ui[1][0]。
 * age 字段，位于：       ui[1][1]。
 * ```
 *
 * `ui[rowIndex][columnIndex]` 中的两个参数如下：
 *
 * * row：行索引，从`0`开始。
 * * column：列索引，从`0`开始。
 *
 * @memberOf module:_it
 * @param {Array<Array<T>|String>} ui 矩阵配置，Grid布局中的表单单元格。
 * @param {Function} eachFun 单个组件专用处理函数，处理
 *        `<Form.Item>{children}</Form.Item>` 标签内的 `children` 专用。
 * @param {Function} itemFun 单个组件中的 Item 处理函数，处理
 *        `<Form.Item {...attrs}>` 中的 `attrs` 专用。
 * @return {Array<Array<T>>} 返回矩阵相关配置，`ui[rowIndex][columnIndex]` 格式
 */
const itUi = (ui = [], eachFun, itemFun = item => item) => {
    ui.forEach((row, rowIndex) => {
        if (U.isArray(row)) {
            row.forEach((cell, cellIndex) => {
                if ("string" === typeof cell) {
                    row[cellIndex] = eachFun(cell);
                } else if (U.isObject(cell)) {
                    row[cellIndex] = itemFun(cell);
                }
            });
        } else {
            ui[rowIndex] = eachFun(row);
        }
    });
    return ui;
};
/**
 * ## 标准函数「Twins」
 *
 * 1. 如果输入是 Array，则直接返回 Array。
 * 2. 如果输入的是 Object，则直接返回 object.items 数据，前提是 items 必须是 Array。
 *
 * @memberOf module:_it
 * @param {Array|Object} row 被遍历的行
 * @return {Array} 规范化过后的行相关信息
 */
const itRow = (row) => {
    if (Is.isArray(row)) {
        return row;
    } else {
        return Is.isArray(row['items']) ? row['items'] : [];
    }
};
/**
 * ## 标准函数
 *
 * 1. 该函数会一直递归，直接执行一层 Array 中的遍历，并且递归替换处理结果。
 * 2. 命中字段中的元素会在处理过后执行原始替换。
 *
 * ```js
 * const array = [
 *      { "name": "Lang", "email": "lang.yu@hpe.com" },
 *      [
 *          { name: "Lang1" },
 *          { name: "Lang2" }
 *      ]
 * ]
 * Ux.itElement(array, "name", (value, item) => {
 *      // value：该字段的值
 *      // item：被遍历的对象本身，它包含了 name 的值
 *     return "Hi " + name;
 * });
 * ```
 *
 * 最终生成的数据格式已经被改动过了，该函数是具有修改副作用的，最终格式中所有的`name`字段中的数据都发生了改变：
 *
 * ```json
 * {
 *     { "name" : "Hi Lang", "email": "lang.yu@hpe.com" },
 *     [
 *         { "name": "Hi Lang1" },
 *         { "name": "Hi Lang2" }
 *     ]
 * }
 * ```
 *
 * ## 参数函数
 *
 * ### itemFun
 *
 * | 参数名 | 类型 | 说明 |
 * |:--- |:---|:---|
 * | value | String | 被遍历的字段值 |
 * | item | Object | 被遍历到的包含了该字段的对象 |
 *
 * @memberOf module:_it
 * @param {Array<Object>} data 被遍历的数组（一般是对象数组）
 * @param {String} field 需要提取的对象对应的字段信息
 * @param {Function} itemFun 每一个元素的遍历专用处理
 * @throws 10071 异常（console.error）
 */
const itElement = (data = [], field = "", itemFun = () => {
}) => {
    E.fxTerminal(!U.isArray(data), 10071, data, "Array");
    E.fxTerminal(!U.isFunction(itemFun), 10071, itemFun, "Function");
    data.forEach(item => {
        if (item) {
            if (Is.isArray(item[field])) {
                item[field] = itElement(item[field], field, itemFun);
            } else {
                item[field] = itemFun(item[field], item);
            }
        }
    });
};
/**
 *
 * ## 标准函数「Twins」
 *
 * `data` 中的每一个元素和 items 中的 `key = value` 构成一个条目，每个条目包含了三元操作数：
 * ( element, key, value ），执行前提是 key 和 value 都合法才执行。
 *
 * > 排除的 key, value 值包括 undefined、null、0 等所有无法通过JS判断的内容
 *
 * ## 参数函数
 *
 * ### fieldFun
 *
 * | 参数名 | 类型 | 说明 |
 * |:--- |:---|:---|
 * | item | Object | 首参：数组中的元素内容 |
 * | key | String | 第二参：传入对象 items 的键值对中的键 |
 * | value | Unknown | 第二参：传入对象 items 的键值对中的值 |
 *
 * @memberOf module:_it
 * @param {Array} data 输入的数组数据
 * @param {Object} items 输入的需要验证的 items 数据
 * @param {Function} fieldFun 最终执行的特殊函数
 */
const itFull = (data = [], items = {}, fieldFun = () => {
}) => {
    E.fxTerminal(!U.isArray(data), 10071, data, "Array");
    E.fxTerminal(!U.isFunction(fieldFun), 10071, fieldFun, "Function");
    data.filter(item => !!item).forEach(item => {
        // eslint-disable-next-line
        for (const key in items) {
            if (items.hasOwnProperty(key)) {
                // item中的值处理
                const value = items[key];
                if (key && value) {
                    // Object -> item
                    // String -> key
                    // Unknown -> value
                    fieldFun(item, key, value);
                }
            }
        }
    });
};
/**
 * ## 标准函数
 *
 * 多迭代模式下的迭代专用操作
 *
 * 1. 遍历 object 中的的每一个字段 field。
 * 2. 拿到 field 对应的值，判断该值 valueRef 是否是一个合法的 Object。
 * 3. 如果合法，则执行 `transformer` 函数（同步函数）得到对应的返回值 processed。
 * 4. 根据 key 进行分离合并操作
 *      1. 如果没有传入 key，则直接将转换过的数据合并到 valueRef 变量中。
 *      2. 如果传入了 key
 *          1. 如果 valueRef 中包含了 key 键的值，则直接合并`（valueRef[key], processed）`。
 *          2. 如果 valueRef 中不包含 key 键的值，则设置：`valueRef[key] = processed`。
 *
 * 在框架内部使用该函数的代码如下：
 *
 * ```js
 *
 * const parsePlugin = (buttons = {}, options = {}) => {
 *     Ux.itValue(buttons, (button = {}) => {
 *         const {plugin = {}} = button;
 *         const configuration = {};
 *         if (plugin.tooltip) {
 *             configuration.tooltip = true;
 *         }
 *         if (plugin.confirm) {
 *             configuration.confirm = options[plugin.confirm];
 *         }
 *         if (plugin.prompt) {
 *             configuration.prompt = options[plugin.prompt];
 *         }
 *         if (plugin.connect) {
 *             configuration.connect = options[plugin.connect];
 *         }
 *         if (plugin.message) {
 *             configuration.message = options[plugin.message];
 *         }
 *         return configuration;
 *     }, 'plugin');
 *     return buttons;
 * };
 *
 * ```
 *
 * > 该函数一般在特殊场景中使用，不会用于单一的场景，特殊场景遍历复杂，会统一消费。
 *
 * ## 参数函数
 *
 * ### transformer
 *
 * | 参数名 | 类型 | 说明 |
 * |:--- |:---|:---|
 * | valueRef | Object | 遍历到的默认的 Object 对象 |
 *
 * @memberOf module:_it
 * @param {Object} object 被迭代的JS的Object对象
 * @param {Function} transformer 执行转换的函数
 * @param {String} [key] 可选的传入键
 */
const itValue = (object = {}, transformer, key) => {
    if (U.isFunction(transformer) && Is.isObject(object)) {
        Object.keys(object).forEach(field => {
            const valueRef = object[field];
            if (U.isObject(valueRef)) {
                const processed = transformer(valueRef);
                if (processed) {
                    if (key) {
                        if (valueRef.hasOwnProperty(key)) {
                            Object.assign(valueRef[key], processed)
                        } else {
                            valueRef[key] = processed;
                        }
                    } else {
                        if (Is.isObject(processed)) {
                            Object.assign(valueRef, processed);
                        }
                    }
                }
            }
        });
    }
};

/**
 *
 * ## 标准函数
 *
 * 遍历树形数组，数组中的每个元素可能包含 `children` 属性，传入数据属于已经构造好的 treeArray，该函数
 * 会递归执行每一个元素，元素包含两种：
 *
 * 1. 顶层 Array 中的每一个元素 element。
 * 2. 没个元素若包含了 Array 类型的 `children` 则表示它包含子节点，直接执行每一个子节点。
 * 3. executor 为每个元素的处理函数（副作用函数）。
 *
 * 框架内部在注入 `_level` 字段时候会使用该函数
 *
 * ```js
 *
 * Ux.itTree(treeData, (item) => {
 *      if (item.hasOwnProperty("_level")) {
 *          item.selectable = item._level <= selectable;
 *      }
 * });
 * ```
 *
 * @memberOf module:_it
 * @param {Array} treeArray 传入的数组对象。
 * @param {Function} executor 执行每个元素的函数。
 */
const itTree = (treeArray = [], executor) => {
    if (U.isFunction(executor)) {
        treeArray.forEach(item => {
            executor(item);
            if (item.children && 0 < item.children.length) {
                itTree(item.children, executor);
            }
        })
    }
};
/**
 * ## 标准函数
 *
 * 二义性函数，consumer 负责每一个元素的生成
 *
 * 1. 如果输入是 `Array` 则返回 `Array`。
 * 2. 如果输入是 `Object` 则返回 `Object`。
 *
 * @memberOf module:_it
 * @param {Object/Array} input 二义性专用方法
 * @param {Function} consumer 执行函数
 * @return {Object/Array} 返回任意值
 */
const itAmb = (input, consumer) => {
    if (Is.isFunction(consumer)) {
        if (Is.isArray(input)) {
            const normalized = [];
            input.map(each => itAmb(each, consumer))
                .forEach(each => normalized.push(each));
            return normalized;
        } else {
            return consumer(input);
        }
    } else return input;
}
/**
 *
 * ## 标准函数
 *
 * 重复执行多次的专用函数
 *
 * @param {Number} loop 循环的次数
 * @param {Function} consumer 每次循环执行的函数
 * @returns {Array} 返回每一次的返回值
 */
const itRepeat = (loop = 0, consumer) => {
    const rets = [];
    if (Is.isFunction(consumer)) {
        for (let idx = 0; idx < loop; idx++) {
            rets.push(consumer(idx));
        }
    }
    return rets;
}
export default {
    itRepeat,
    itAmb,
    itMatrix,
    itObject,
    itValue,
    itUi,
    itRow,
    itFull,
    itElement,
    itTree,
}