import U from "underscore";
import E from '../error';
import V from './O.immutable';
import Q from 'q';
import Is from './O.is';

/**
 *
 * ## 特殊函数「Monad, Ambiguity」
 *
 * 多义性方法，用于返回不同结果的 Promise，多用于函数链中，该方法只对 1,2,3 的长度有效，
 * 不在这个长度范围内时会直接返回 `Promise.reject` 的异常信息。
 *
 * 1. 长度为`1`，直接返回`new Promise`，将传入对象封装成 Promise 返回，同步转异步。
 * 2. 长度为`2`，使用 Supplier 和第二参直接生成 Promise 返回（延迟异步，同步转异步）。
 * 3. 长度为`3`，一般用于 Monad 函数链，通常在状态迁移中处理。
 *
 * ### 长度1
 *
 * ```js
 * const user = {
 *     username: "Lang Yu"
 * };
 * const promise = Ux.promise(user);
 * ```
 *
 * ### 长度2
 *
 * ```js
 * const supplier = (params = {}) => {
 *
 *      // 构造新的 Promise
 *      return Ux.ajaxGet("/api/test/:key", params);
 * };
 * const promise = Ux.promise(supplier, {key:"user.id"});
 * ```
 *
 * ### 长度3【巧】技巧代码
 *
 *
 * #### 旧代码
 *
 * ```js
 *
 * const state = {};
 * Ux.ajaxGet("/api/test").then(response => {
 *     state.$data = response;
 *     return Ux.promise(state);
 * })
 * ```
 *
 * #### 新代码
 *
 * ```js
 * const state = {};
 * Ux.ajaxGet("/api/test")
 *      .then(response => Ux.promise(state, "$data", response));
 * ```
 *
 * @memberOf module:_async
 * @param {arguments} [arguments] 可变长度参数
 * @returns {Promise<T>} 返回最终的 Promise
 */
function promise() {
    if (1 === arguments.length) {
        const value = arguments[0];
        if (value instanceof Promise) {
            return value
                .then(data => [null, data])
                .catch(error => [error, null]);
        } else {
            return new Promise((resolve, reject) => {
                if (value._error) {
                    reject(value);
                } else {
                    resolve(value);
                }
            });
        }
    } else if (2 === arguments.length) {
        const supplier = arguments[0];
        const params = arguments[1];
        if (U.isFunction(supplier)) {
            const promise = supplier(params);
            if (promise instanceof Promise) {
                return promise;
            } else {
                return E.fxReject;
            }
        } else {
            return E.fxReject;
        }
    } else if (3 === arguments.length) {
        const state = arguments[0];
        const key = arguments[1];
        state[key] = arguments[2];
        return promise(state);
    } else {
        return E.fxReject;
    }
}

/**
 *
 * ## 特殊函数「Monad, Ambiguity」
 *
 * 并行 Promise 专用函数，每个 Promise 会同时执行最终合并结果，直接构造并行运行结果
 *
 * 1. 如果不传第二参数，keys 长度为 0，则直接返回 `[x]` 的 promises 直接结果
 * 2. 如果传入第二参，keys 长度 > 0，则会返回 `{}` 的 promises 直接结果
 *
 * ### 直接并行 []
 *
 * ```js
 * const promiseArray = [
 *      promise1,       // 假设返回 {name:"Lang"}
 *      promise2,       // 假设返回 [1,2]
 *      promise3        // 假设返回 "3 Promise"
 * ];
 * Ux.parallel(promiseArray).then(response => {
 *      // response 数据结构：
 *      // [
 *      //      {name, "Lang"},
 *      //      [1,2],
 *      //      "3 Promise"
 *      // ]
 * });
 * ```
 *
 * ### 异构并行 {}
 *
 * ```js
 * const promiseArray = [
 *      promise1,       // 假设返回 {name:"Lang"}
 *      promise2,       // 假设返回 [1,2]
 *      promise3        // 假设返回 "3 Promise"
 * ];
 * Ux.parallel(promiseArray, "user", "number").then(response => {
 *      // response 数据结构：
 *      // {
 *      //      "user": {name, "Lang"},
 *      //      "number": [1,2],
 *      //      "2": "3 Promise"
 *      // }
 * });
 * ```
 *
 * @memberOf module:_async
 * @param {Array} promises 一个 Promise 的数组。
 * @param {String[]} keys 一个包含键的数组，用于处理最终返回值专用。
 * @returns {Promise<T>} 返回最终的 Promise
 */
function parallel(promises = [], ...keys) {
    if (0 === keys.length) {
        /*
         * 直接返回 Q.all
         */
        return Q.all(promises);
    } else {
        /*
         * 返回 处理结果
         */
        const args = [];
        keys.forEach(key => args.push(key));
        return Q.all(promises).then(response => {
            const result = {};
            response.forEach((item, index) => {
                const key = args[index] ? args[index] : index;
                result[key] = V.clone(item);
            });
            return promise(result);
        });
    }
}

/**
 *
 * ## 特殊函数「Monad」
 *
 * 顺序链接 Promise 专用函数，最终构造成 Monad 链
 *
 * ```shell
 * input -> Monad1 -> out1,
 * out1 ->  Monad2 -> out2,
 * out2 ->  Monad3 -> out3,
 * ....
 *
 * # 最终构造链式结构
 * Monad1 -> Monad2 -> Monad3 -> ... -> Monadn
 * ```
 *
 * 执行步骤如下：
 *
 * 1. 数组中的每一个元素都必须是一个**函数生成器**（generator），每调用一次会生成这个节点的 Promise
 * 2. 使用 generator 的目的是保证每个 Promise 都是延迟生成。
 * 3. 按照流程，第一个 generator 生成了 Promise 过后，会使用 then 的方式继续往下直到最后一个执行完成。
 *
 * @memberOf module:_async
 * @param {Array} generator 构造每一个节点的 Promise 的专用函数
 * @param {any} input 第一个节点的 Promise 的输入参数
 * @returns {Promise<T>} 返回最终的 Promise 信息
 */
const passion = async (generator = [], input) => {
    if (0 === generator.length) {
        throw new Error("[ Ux ] 顺序执行 Promise 时不可构造空队列！");
    } else {
        try {
            if (1 === generator.length) {
                // 这种模式下必须是 generator，而不是promise
                return await generator[0](input);
            } else {
                let processor = generator[0](input);
                for (let idx = 1; idx < generator.length; idx++) {
                    const previous = await processor;
                    processor = generator[idx](previous);
                }
                return await processor;
            }
        } catch (error) {
            console.error(error);
        }
    }
};

/**
 * ## 特殊函数「Monad, Dev」
 *
 * 输入可变长度的参数执行调试专用
 *
 * 1. 长度为1：根据参数长度判断当前信息如何处理
 *      1. Object参数，直接返回这个Object的完成信息生成Promise
 *      2. String参数，返回Function函数，从函数参数中提取 `field = String`的键值
 *
 * ```js
 *
 * // 该方法仅在 "开发环境" 中使用，其他地方无法使用
 * const user = {
 *     username: "Lang",
 *     email: "lang.yu@hpe.com"
 * }
 * return Ux.promise(user)
 *
 *      // 直接打印整个 user 对象的信息
 *      .then(Ux.debug)
 *
 *      // 仅打印 user 对象的 email 字段
 *      .then(Ux.debug("email"));
 * ```
 *
 * @memberOf module:_async
 * @param {arguments} [arguments] 可变长度参数
 * @returns {Promise<T>} 返回一个Promise
 */
function debug() {
    if (1 === arguments.length) {
        const input = arguments[0];
        if (input) {
            if (U.isObject(input)) {
                console.debug(input);
                return promise(input);
            } else if ("string" === typeof input) {
                return response => {
                    console.debug(response[input]);
                    return promise(response);
                }
            }
        }
    } else {
        throw new Error("[ Ux ] 调试方法不对")
    }
}

/**
 * ## 特殊函数「Monad」
 *
 * 输入可变长度参数相关信息，暂时支持：
 *
 * 1. 长度为1：必须输入 `reference`（React中的Component）
 *
 * 该方法主要位于 `then` 的函数链执行，执行过后会更新 React 组件中的状态。
 *
 * ### 【巧】技巧代码
 *
 * #### 旧代码
 *
 * ```js
 *
 * const reference = "从外置传入的 reference ";
 * Ux.ajaxGet("/api/pipe").then(state => {
 *     reference.setState(state);
 *     return Ux.promise(state);
 * });
 *
 * ```
 *
 * #### 新代码
 *
 * ```js
 *
 * // 使用 pipe 过后的改动代码
 * const reference = "从外置传入的 reference ";
 * Ux.ajaxGet("/api/pipe").then(Ux.pipe(reference));
 *
 * ```
 *
 * @memberOf module:_async
 * @param {arguments} [arguments] 可变长度参数
 * @returns {Promise<T>} 返回一个Promise
 */
function pipe() {
    if (1 === arguments.length) {
        const input = arguments[0];
        if (input) {
            if (Is.isFunction(input.setState)) {
                return state => {
                    input.setState(state);
                    return promise(state);
                }
            } else {
                console.error("[ Ux ] 必须传入 reference 变量，当前不合法", input);
            }
        } else {
            throw new Error("[ Ux ] pipe 方法为特殊方法，必须保证参数，当前参数不存在！");
        }
    } else {
        throw new Error("[ Ux ] pipe 方法参数长度不对！");
    }
}

/**
 * ## 特殊函数「Monad」
 *
 * 在 Zero Extension 中，内置了配置准备状态，state 中的 $ready，当界面 componentDidMount 执行完成后
 * 会将 $ready 设置成 true
 *
 * 1. $ready = false：等待配置完成。
 * 2. $ready = true：配置执行完成，执行过程可以是异步
 *
 * ###【巧】技巧代码
 *
 * #### 旧代码
 *
 * ```js
 * const key = "1";
 *
 * Ux.ajaxGet("/api/user",key).then(state => {
 *      state.$ready = true;
 *      return Ux.promise(state);
 * });
 * ```
 *
 * #### 新代码
 *
 * ```js
 * // 使用 ready 过后的改动代码
 * const key = "1";
 *
 * Ux.ajaxGet("/api/user",key).then(Ux.ready);
 * ```
 *
 * 该方法只能作为`Monad`的中间节点，不可用于尾部节点或开始节点，只能处于函数链的中间环节。
 *
 * @memberOf module:_async
 * @param state 处理之前的原始状态信息，函数链上的 Monad
 * @returns {Promise<T>} 返回一个新的 Promise
 * @async
 */
const ready = (state = {}) => {
    state.$ready = true;
    return promise(state);
};
export default {
    promise,
    parallel,
    passion,
    pipe,
    ready,
    debug
}