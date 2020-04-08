import {DataArray, DataObject} from "entity";
import Immutable from "immutable";
import It from "./O.it";
import Is from './O.is';
import U from "underscore";
import moment from "moment";

/**
 * ## 标准函数
 *
 * ```js
 * // 直接拷贝对象，拷贝过后的对象的任何更改都不会反应到原始对象
 * const before = {
 *      name: "Lang"
 * };
 * const after = Ux.clone(before);
 * after.name = "Lang2";
 * console.info(item,input);
 *
 * // before 的值依旧是：{ name: "Lang" }
 * // after 的值为修改后的值 { name: "Lang2" };
 * ```
 *
 * @memberOf module:_primary
 * @param {DataObject | DataArray | Object} input 传入合法对象，
 * @returns 返回拷贝好的 Object
 */
const clone = (input) => {
    if (input instanceof DataObject || input instanceof DataArray) {
        if (input.is()) {
            const object = input.to();
            // Object.freeze(object); freeze会变成只读对象
            return Immutable.fromJS(object).toJS();
        } else {
            if (input instanceof DataObject) {
                return Immutable.fromJS({}).toJS();
            } else {
                return Immutable.fromJS([]).toJS();
            }
        }
    } else {
        if (input) {
            // Object.freeze(input);
            return Immutable.fromJS(input).toJS();
        } else {
            return input;
        }
    }
};
/**
 * ## 标准函数
 *
 * 三种模式的拷贝函数，增强版原始 assign 考别
 *
 * * mode = 0 ：直接覆盖，内部调用`Object.assign`方法
 * * mode = 1 ：深度覆盖，不直接覆盖子对象，递归往下，发现同键数据后使用覆盖
 * * mode = 2 ：深度追加，不直接覆盖子对象，递归往下，同键不存在则追加
 *
 * ```js
 * const target = {
 *     name: "mode"
 * };
 * const source = {
 *     email: "lang.yu@hpe.com"
 * };
 * ```
 *
 * // 等价于 Object.assign(target,source);
 * const combine = Ux.assign(target,source);
 *
 * @memberOf module:_primary
 * @param {Object} target 拷贝目标（副作用修改）
 * @param {Object} source 拷贝源
 * @param {Number} mode 模式参数，用于不同的模式
 * @returns {Object} 合并好的JavaScript对象Object
 */
const assign = (target = {}, source = {}, mode = 0) => {
    if (!target) target = {};
    let result = clone(target);
    if (0 === mode) {
        result = Object.assign(target, source);
    } else {
        It.itObject(source, (field, value) => {
            // 检查target中是否包含了field
            const targetValue = result[field];
            if (U.isObject(targetValue) && !moment.isMoment(targetValue) &&
                U.isObject(value) && !moment.isMoment(value)) {
                // 当前节点为两个对象，统一方式合并，且mode也相同
                result[field] = assign(targetValue, value, mode);
            } else {
                if (1 === mode) {
                    // 直接覆盖
                    result[field] = value;
                } else if (2 === mode) {
                    // 没有属性才追加
                    if (!target.hasOwnProperty(field)) {
                        result[field] = value;
                    }
                }
            }
        });
    }
    return result;
};
/**
 * ## 特殊函数「Ambiguity」
 *
 * 专用输入切换函数，用于处理多输入的判断反射录入，其中一种传入为`event`，该
 * event 是 HTML 中的 `native` 本地事件。
 *
 * ```js
 *      // 绑定事件
 *      const onClick = (event) => {
 *          Ux.prevent(event);
 *      }
 *      // 直接传入参数
 *      const onForm = (params = {}) => {
 *          const request = Ux.prevent(params);
 *      }
 * ```
 *
 * @memberOf module:_primary
 * @method prevent
 * @param {Event} event 传入事件或对象
 * @return {Object} 返回对象信息
 */
const prevent = (event) => {
    /* 保证安全调用 */
    if (event && U.isFunction(event.preventDefault)) {
        event.preventDefault();
        return {};
    } else {
        /* 二义性，返回对应的Object值 */
        if (Is.isObject(event)) {
            return event;
        } else return {};
    }
};
export default {
    prevent,
    // 拷贝对象
    clone,
    /**
     * ## 集成函数
     *
     * 直接调用 `immutable` 包中的 Immutable.fromJS 函数，生成 Immutable 对象
     * ```
     * const item = ["key", "key1"];
     * const $item = Ux.immutable(item);
     *
     * console.info($item.contains("key"));
     * ```
     *
     * @memberOf module:_primary
     * @param {Object | Array} input 输入对象，可以是任意 JavaScript 对象
     * @return {Map | List} Immutable库中需要使用的专用对象
     */
    immutable: (input) => Immutable.fromJS(input),
    // 合并对象
    assign,
}