import U from "underscore";
import Immutable from "immutable";
import {DataArray, DataObject} from "entity";
import moment from "moment";
import Q from "q";
import Cv from "./constant";
import E from './error';

// ------------------------------- object.js ------------------------

/**
 * ## 「标准」`Ux.slice`
 *
 * 切片函数，针对对象或数组直接执行切片操作，生成新的子元素（可以是Object，也可以是Array）。
 *
 * ### Object 类型
 *
 * ```js
 * const before = {
 *     a: "a", b:"b", c:"c"
 * }
 * const after = Ux.slice(before, "a", "b");
 * // after 的最终值是：{ a:"a", b:"b" }
 * ```
 *
 * ### Array 类型
 *
 * ```js
 * const before = [
 *      { a: "a1",  b: "b1", c: "c1" }.
 *      { a: "a2",  b: "b2", c: "c2" }.
 * ]
 * const after = Ux.slice(before, "b", "c");
 * // after 的最终结果是：
 * // [
 * //      { b:"b1", c:"c1" },
 * //      { b:"b2", c:"c2" }
 * // ]
 * ```
 *
 * @memberOf module:_primary
 * @param {Array|Object} input 输入可以是对象，可以是数组
 * @param {String[]} keys 可变参数，每个元素都是字符串
 * @returns {Object} 返回子集对象
 */
const slice = (input, ...keys) => {
    if (0 < keys.length) {
        const fnClone = (item) => {
            const newItem = {};
            keys.filter(each => item.hasOwnProperty(each))
                .forEach(key => newItem[key] = item[key]);
            return newItem;
        };
        if (U.isArray(input)) {
            return input.map(each => fnClone.apply(this, [each].concat(keys)));
        } else if (U.isObject(input)) {
            return fnClone.apply(this, [input].concat(keys));
        } else return {};
    } else return {};
};
const Letter = {
    UPPER: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    LOWER: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
};
/**
 * ## 「标准」`Ux.sequence`
 *
 * 序号生成函数，根据输入生成相关序号信息，第二参支持的模式如下：
 *
 * 1. DIGEST：数字序号：1,2,3,4
 * 2. UPPER：大写字母序号：A,B,C,D 等
 * 3. LOWER：小写字母序号：a,b,c,d 等
 *
 * 如数参数input必须是数值，如果不是数值则直接报错，该函数会返回对应序号中的值。
 *
 * @memberOf module:_primary
 * @param {Number} input 输入的序号，序号从 1 开始
 * @param {String} mode 当前生成序号的模式，支持三种模式
 * @returns {String|Number} 生成的序号信息
 *
 */
const sequence = (input, mode = "DIGEST") => {
    if ("number" === typeof input) {
        if ("UPPER" === mode) {
            return Letter.UPPER[input - 1];
        } else if ("LOWER" === mode) {
            return Letter.LOWER[input - 1];
        } else return input;
    } else {
        console.info("输入参数 input 类型错误", input);
    }
};
/**
 * ## 「标准」`Ux.denull`
 *
 * 针对传入的Object类型执行**去空**操作，删除掉数据中 field = null 的属性键值对。
 *
 * 执行前
 *
 * ```json
 * {
 *     "username": "Lang",
 *     "password": "pl,okmijn123",
 *     "email": null
 * }
 * ```
 *
 * 执行后
 *
 * ```json
 * {
 *     "username": "Lang",
 *     "password": "pl,okmijn123"
 * }
 * ```
 *
 * > 由于Array类型可直接在 filter 方法中直接处理，所以不需要特殊的 denull 方法来执行过滤，而Object没有该方法过滤，所以提供该API。
 *
 * @memberOf module:_primary
 * @param {Object} data 输入的对象信息
 * @returns {Object} 返回处理过后的对象原始引用
 */
const denull = (data = {}) => {
    const nullKeys = Object.keys(data).filter(key => null === data[key]);
    nullKeys.forEach(nullKey => delete data[nullKey]);
    return data;
}
/**
 * ## 「标准」`Ux.input`
 *
 * 数据转换专用函数，`params -> mapping -> request`的流程，此处request为转换后的函数。
 *
 * 如：
 *
 * 数据文件 params：
 *
 * ```json
 * {
 *     "username": "Lang",
 *     "email": "lang.yu@hpe.com"
 * }
 * ```
 *
 * 配置文件 mapping：
 *
 * ```json
 * {
 *     "username": "account"
 * }
 * ```
 *
 * 转换过后的输出信息为：
 *
 * ```json
 * {
 *     "account": "Lang",
 *     "email": "lang.yu@hpe.com"
 * }
 * ```
 *
 * > 从转换流程可以知道，这个配置的转换流程是正向转换，执行前端映射。
 *
 * @memberOf module:_primary
 * @param {Object} params 输入的对象信息
 * @param {Object} mapping 传入更改对象的映射的
 * @returns {Object} 返回执行过后的结果。
 */
const input = (params = {}, mapping = {}) => {
    if (isEmpty(mapping)) {
        return params;
    } else {
        const normalized = {};
        Object.keys(mapping).forEach((input) => {
            const output = mapping[input];
            if (input && output &&
                "string" === typeof input && "string" === typeof output) {
                normalized[output] = params[input];
            }
        });
        // 补充没转换的
        Object.keys(params)
            .filter(field => !mapping.hasOwnProperty(field))
            .forEach(left => normalized[left] = params[left]);
        return normalized;
    }
}
/**
 * ## 「标准」`Ux.output`
 *
 * 这个函数是`Ux.input`的逆向操作函数，会执行mapping配置中的逆向转换，通常是处理响应用`response -> mapping -> params`。
 *
 * @memberOf module:_primary
 * @param {Object} params 输入的对象信息
 * @param {Object} mapping 传入更改对象的映射的
 * @returns {Object} 返回执行过后的结果。
 */
const output = (params = {}, mapping = {}) => {
    const revert = {};
    itObject(mapping, (field, value) => {
        revert[value] = field;
    });
    return input(params, revert);
}
/**
 * ## 「引擎」`Ux.getV`
 *
 * 从reference的state和props中分批读取数据
 *
 * 1. 先从reference.state中读取数据。
 * 2. 如果第一步失败，则从reference.props中读取数据。
 *
 * > 此处说明一下读取数据的优先级问题，根据目前实战的情况看起来，先从state中读取，再从props中读取的流程存在于多个组件中
 * > 并不是空穴来风的设计，所以存在这种读取方式，不仅仅是`denull`的API，包括很多读取函数以及后续的API都有该操作流程。
 *
 * @memberOf module:_primary
 * @param {ReactComponent} reference 某个React组件的引用
 * @param {String} key 读取状态和属性值时传入的属性名
 * @returns {any} 返回最终数据。
 */
const getV = (reference, key) => {
    if (reference) {
        let found;
        if (reference.state) {
            found = reference.state[key];
        }
        if (!found) {
            if (reference.props) {
                found = reference.props[key];
            }
        }
        return found;
    }
}

// ------------------------------- promise.js ------------------------

/**
 *
 * ## 「标准」`Ux.promise`
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
 * ### 长度3
 *
 * > 【巧】技巧代码
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
 * 该API提供的方法在整个Promise链中为高频使用方法，他的使用场景有很多，主要是用于修正代码编写风格，使用场景如下：
 *
 * 1. 直接将一个对象Object/Array等转换成带有异步Promise的数据结构，可直接调用`.then`的API。
 * 2. 长度2的使用场景主要用于切面AOP的编程，通常在很多场景中需要执行多维度构造，特别是中间维度的Promise的构造过程。
 * 3. 长度3的使用场景则通常用于`componentDidMount`的生命周期中，用于实现挂载流程，如`response -> state[key] = response`的结构。
 *
 * 该方法存在的意义在于封装了ES6中出现的Promise流程，方便整体调用，Zero Ui的理念是封装第三方，那么第三方的内容封装越多，开发人
 * 员对本身框架的操作程度会越过，其实第一种应用是最常用的，其次是配置化流程中通常使用第二和第三种流程。
 *
 * @memberOf module:_primary
 * @async
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
                if (value && value._error) {
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
 * ## 「标准」`Ux.parallel`
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
 * @memberOf module:_primary
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
                if (isObject(item) || isArray(item)) {
                    result[key] = clone(item);
                } else {
                    result[key] = item;
                }
            });
            return promise(result);
        });
    }
}


/**
 *
 * ## 「标准」`Ux.passion`
 *
 * 顺序链接 Promise 专用函数（串行Promise），最终构造成 Monad 链
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
 * @memberOf module:_primary
 * @async
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
 * ## 「开发专用」`Ux.debug`
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
 * @memberOf module:_primary
 * @async
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
 * ## 「引擎」`Ux.pipe`
 *
 * 输入可变长度参数相关信息，暂时支持：
 *
 * 1. 长度为1：必须输入 `reference`（React中的Component）
 *
 * 该方法主要位于 `then` 的函数链执行，执行过后会更新 React 组件中的状态，该方法有一定的副作用，因为它会执行一次`setState`，
 * 所以真正使用这个函数时通常放在整个链式结构的尾部，而尾部执行操作可让系统处于最终的**加载完成**的状态。
 *
 * >【巧】技巧代码
 *
 *
 *
 * ### 旧代码
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
 * ### 新代码
 *
 * ```js
 *
 * // 使用 pipe 过后的改动代码
 * const reference = "从外置传入的 reference ";
 * Ux.ajaxGet("/api/pipe").then(Ux.pipe(reference));
 *
 * ```
 *
 * @memberOf module:_primary
 * @async
 * @param {arguments} [arguments] 可变长度参数
 * @returns {Promise<T>} 返回一个Promise
 */
function pipe() {
    if (1 === arguments.length) {
        const input = arguments[0];
        if (input) {
            if (isFunction(input.setState)) {
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
 * ## 「引擎」`Ux.ready`
 *
 * 在 Zero Extension 中，内置了配置准备状态，state 中的 $ready，当界面 componentDidMount 执行完成后
 * 会将 $ready 设置成 true，该函数几乎是整个Zero Ui的核心，主要用于设置生命周期的完整。
 *
 * 1. $ready = false：等待配置完成。
 * 2. $ready = true：配置执行完成，执行过程可以是异步
 *
 * ### 旧代码
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
 * ### 新代码
 *
 * ```js
 * // 使用 ready 过后的改动代码
 * const key = "1";
 *
 * Ux.ajaxGet("/api/user",key).then(Ux.ready);
 * ```
 *
 * 该方法只能作为`Monad`的中间节点，不可用于尾部节点或开始节点，只能处于函数链的中间环节，Zero中常用的一段代码如：
 *
 * ```js
 * // 下边代码是常用代码，可设置 $ready = true 来实现准备完成
 * <Promise>.then(Ux.ready).then(Ux.pipe(this));
 * ```
 *
 * > 在React组件的生命周期中，componentDidMount会执行Ajax的异步操作，到最后设置`$ready=true`的标识来表示回调
 * > 完成，而这种回调完成刚好可应用于当前组件，也就是说当`$ready=true`时，状态加载彻底完成。
 *
 * @memberOf module:_primary
 * @async
 * @param state 处理之前的原始状态信息，函数链上的 Monad
 * @returns {Promise<T>} 返回一个新的 Promise
 */
const ready = (state = {}) => {
    state.$ready = true;
    return promise(state);
};


/**
 * ## 「标准」`Ux.packet`
 *
 * 包装过的 Promise，解决内存Bug，中途 Cancel，如果出现异常则执行中断处理，该中断处理可解决当出现异步异常时的基本
 * 流程，通过中断也可以实现Bug的处理。
 *
 * @memberOf module:_primary
 * @async
 * @param {Promise<T>} promise 传入一个合法的Promise。
 * @returns {Promise<T>|Object} 返回Promise或同步结果。
 */
const packet = (promise) => {
    let hasCanceled = false
    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then(
            response => (hasCanceled ? reject({isCanceled: true}) : resolve(response)),
            error => (hasCanceled ? reject({isCanceled: true}) : reject(error))
        )
    })
    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled = true
        }
    }
}


/**
 * ## 「引擎」`Ux.pass`
 *
 * 根据传入的field值同时从reference中提取数据，提取结果通常是Object，然后执行合并
 *
 * 1. props中的同名属性值会覆盖state中的同名属性值。
 * 2. 最终合并过程不会修改输入：
 *      1. 如果是props本身是只读，不能变更。
 *      2. 如果是state更改只能使用setState，不可直接变更。
 *
 * > 该函数会执行combine的合并操作，合并操作会实现对象的提取，带有子对象处理功能。
 *
 * @memberOf module:_primary
 * @param {ReactComponent} reference React组件引用
 * @param {String} field 提取数据的属性值
 * @returns {Object} 返回合并过后的对象信息
 */
const pass = (reference, field) => {
    if (field) {
        const stateRef = reference.state ? reference.state : {};
        const stateData = stateRef[field] ? stateRef[field] : {};

        const propRef = reference.props ? reference.props : {};
        const propData = propRef[field] ? propRef[field] : {};
        const combine = {};
        // 属性覆盖状态，属性优先级更高
        Object.assign(combine, stateData, propData);
        return combine;
    } else {
        return {};
    }
}


/**
 * ## 「标准」`Ux.monad`
 *
 * Monad 生成器，用于生成多维函数链，它的执行流程如下：
 *
 * 1. input输入
 * 2. funArray[0]执行：input -> ret0
 * 3. funArray[1]执行：ret0 ( input1 ) -> ret1
 * 4. funArray[2]执行：ret1 ( input2 ) -> ret2
 * .....
 *
 * 传入的`funArray`中的每一个元素都是Function类型，如果不是Function类型则直接跳过不执行，最终会生成一个搭载了
 * 函数链的综合函数，用于执行Monad专用函数链。
 *
 * `input -> funArray[0] -> funArray[1] -> funArray[2] -> .... -> output`
 *
 * 该API用于函数式编程，只支持同步模式，异步模式目前不支持。
 *
 * @memberOf module:_primary
 * @param {Array} funArray 传入的可绑定函数数组，每个元素都是一个 Function
 * @returns {Function}
 */
const monad = (funArray = []) => {
    return (input = {}) => {
        let ret = clone(input);
        for (let idx = 0; idx < funArray.length; idx++) {
            const fun = funArray[idx];
            if (isFunction(fun)) {
                ret = fun(ret);
            }
        }
        return ret;
    }
}
// ------------------------------- is.js -----------------------------

/**
 * ## 「标准」`Ux.isCn`
 *
 * 判断当前字符串中是否是`合法中文`，如果包含了中文则直接返回true，主要用于当前字符串中
 * 是否包含了中文信息，在Zero Ui中使用时，会针对列宽度计算执行中文宽度计算，而开发人员
 * 也可以直接调用该API进行检查。
 *
 * ```js
 * const item = "你好";
 * const isCn = Ux.isCn(item);  // 返回 true
 * ```
 *
 * @memberOf module:_is
 * @param {String} literal 输入的原始字符串
 * @returns {boolean} 匹配返回true，否则返回false
 */
const isCn = (literal) =>
    /.*[\u4e00-\u9fa5]+.*$/
        .test(literal);


/**
 * ## 「标准」`Ux.isNumber`
 *
 * 判断当前字符串是否是`合法整数`，只有合法整数才会返回true。
 *
 * ```js
 * const literal = "1233";
 * const isNumber = Ux.isNumber(literal);       // 返回 true
 * ```
 *
 * @memberOf module:_is
 * @param {String} literal 输入的原始字符串
 * @returns {boolean} 匹配返回true，否则返回false
 */
const isNumber = (literal) =>
    /^-?[1-9]\d*$/g
        .test(literal);


/**
 * ## 「标准」`Ux.isCurrency`
 *
 * 判断当前字符串是否是合法货币格式，合法的货币格式包含两种：
 *
 * 1. 基本浮点格式。
 * 2. 带千分位逗号的货币格式。
 *
 * ```js
 * const literal = "12.33";
 * const literal2 = "1,135.65";
 * const isDecimal = Ux.isCurrency(literal);     // 返回 true
 * const isDecimal2 = Ux.isCurrency(literal);    // 返回 true
 * ```
 *
 * @memberOf module:_is
 * @param {String} literal 输入的原始字符串
 * @returns {boolean} 匹配返回true，否则返回false
 */
const isCurrency = (literal) =>
    /^(([1-9]\d*)(\.\d{1,2})?)$|^(0\.0?([1-9]\d?))$/g
        .test(literal);


/**
 * ## 「标准」`Ux.isDecimal`
 *
 * 判断当前字符串是否是合法浮点数，合法浮点数是带一个小数点的小数。
 *
 * ```js
 * const literal = "12.33";
 * const isFloat = Ux.isDecimal(literal);        // 返回 true
 * ```
 *
 * @memberOf module:_is
 * @param {String} literal 输入的原始字符串
 * @returns {boolean} 匹配返回true，否则返回false
 */
const isDecimal = (literal) =>
    /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/
        .test(literal);

const isRuleKv = (record = {}, field, op = "EQ", expected) => {
    const actualValue = record[field];
    let checked;
    switch (op) {
        // 不为空，有值
        case "NIL":
            checked = !!actualValue;
            break;
        // 为空，无值
        case "NUL":
            checked = !actualValue;
            break;
        // 等于
        case "EQ":
            checked = (actualValue === expected);
            break;
        // 不等于
        case "NEQ":
            checked = (actualValue !== expected);
            break;
        // 大于
        case "GT":
            checked = (actualValue > expected);
            break;
        // 大于等于
        case "GE":
            checked = (actualValue >= expected);
            break;
        // 小于
        case "LT":
            checked = (actualValue < expected);
            break;
        // 小于等于
        case "LE":
            checked = (actualValue <= expected);
            break;
        // 以某个字符串开始
        case "ST":
            checked = (actualValue) ? actualValue.startsWith(expected) : false;
            break;
        // 以某个字符串结束
        case "ET":
            checked = (actualValue) ? actualValue.endsWith(expected) : false;
            break;
        // 包含了某个字符串
        case "CT":
            checked = (actualValue) ? 0 <= actualValue.indexOf(expected) : false;
            break;
        // 不包含某个字符串
        case "CF":
            checked = (actualValue) ? 0 > actualValue.indexOf(expected) : false;
            break;
        default:
            checked = false;
            break;
    }
    return checked;
}
const _isAndOr = (array = [], isAnd = false) => {
    const counter = array.filter(item => true === item).length;
    if (isAnd) {
        return counter === array.length;
    } else {
        return counter > 0;
    }
}
const _isObject = (input) => {
    if (input) {
        return !U.isArray(input) && U.isObject(input);
    } else return false;
}
/**
 * ## 「标准」`Ux.isRule`
 *
 * ### 1. 基本介绍
 *
 * 检查记录record是否符合ruleConfig中的定义，该定义为前端查询引擎检查，配合解析表达式实现针对
 * 数据中条件值的检查，如果符合规则，则返回true，否则返回false。
 *
 * ### 2. 规则说明
 *
 * ruleConfig的数据结构如下：
 *
 * ```json
 * {
 *     "field1": "<RULE>",
 *     "field2": "<RULE>",
 *     "", true / false
 * }
 * ```
 *
 * 其中`<RULE>`的完整值列表如下：
 *
 * 1. `NIL`：该属性必须不为空
 * 2. `NUL`：该属性必须为空
 * 3. `GT,<N>`：该属性大于某个值
 * 4. `GE,<N>`：该属性大于等于某个值
 * 5. `LT,<N>`：该属性小于某个值
 * 6. `LE,<N>`：该属性小于等于某个值
 * 7. `EQ,<S>`：该属性等于某个值
 * 8. `NEQ,<S>`：该属性不等于某个值
 * 9. `ST,<S>`：以某个字符串开始
 * 10. `ET,<S>`：以某个字符串结束
 * 11. `CT,<S>`：包含了某个字符串
 * 12. `CF,<S>`：不包含某个字符串
 *
 * @memberOf module:_is
 * @param {Object} record 输入的数据记录
 * @param {Object} ruleConfig 输入的规则定义
 * @return {Boolean} 满足规则返回true，否则返回false
 */
const isRule = (record = {}, ruleConfig = {}) => {
    // AND / OR
    const isAnd = (false !== ruleConfig[""]);
    // matchArray = [true, false, true, false, ...]
    const matchArray = Object.keys(ruleConfig)
        .filter(key => "" !== key)
        .filter(key => !!ruleConfig[key])
        .map(key => {
            // 处理规则
            const ruleItem = ruleConfig[key];
            /*
             * NIL, NUL
             */
            let op;
            let expected;
            if ("NIL" === ruleItem || "NUL" === ruleItem) {
                op = ruleItem;
            } else {
                if (0 <= ruleItem.indexOf(',')) {
                    op = ruleItem.split(',')[0];
                    expected = ruleItem.split(',')[1];
                } else {
                    op = "EQ";
                    expected = ruleItem;
                }
            }
            return isRuleKv(record, key, op, expected);
        });
    return _isAndOr(matchArray, isAnd);
}

/**
 * ## 「标准」`Ux.isRuleAll`
 *
 * （略），针对Array执行每个元素的`isRule`检查，最后用And连接。
 *
 * @memberOf module:_is
 * @param {Array} array 输入的数组记录
 * @param {Object} ruleConfig 输入的规则定义
 * @return {Boolean} 全满足则返回true，数据和数据之间用AND
 */
const isRuleAll = (array = [], ruleConfig = {}) => {
    const matchArray = array
        .filter(_isObject)
        .map(item => isRule(item, ruleConfig));
    return _isAndOr(matchArray, true);
}

/**
 * ## 「标准」`Ux.isRuleAny`
 *
 * （略），针对Array执行每个元素的`isRule`检查，最后用Or连接。
 *
 * @memberOf module:_is
 * @param {Array} array 输入的数组记录
 * @param {Object} ruleConfig 输入的规则定义
 * @return {Boolean} 满足一条则返回true，数据和数据之间用Or
 */
const isRuleAny = (array = [], ruleConfig = {}) => {
    const matchArray = array
        .filter(_isObject)
        .map(item => isRule(item, ruleConfig));
    return _isAndOr(matchArray, false);
}

/**
 * ## 「标准」`Ux.isDiff`
 *
 * 判断两个对象是否不同，内部使用`Immutable.is` 判断，等价于 Java 语言中的
 * equals 方法:
 *
 * 1. 如果是原始JS数据类型，则直接比对二者是否不同。
 * 2. 如果是JS中的对象（Array, Object), 则比较二者的内容是否不同。
 * 3. 如果是自定义的 DataArray, DataObject, 则比较二者内容是否不同。
 *
 * 该比对方法针对内部数据结构以及内容执行真正意义上的比对流程，所以不存在`===`的引用比对流程，通过比对来判断两者数据内容是否一致。
 * 次方法的比对结果使用频率远高于`===`的比对。众所周知，JavaScript中的三等号在比较Object/Array时比较的是二者的引用地址是否
 * 一致，而不是数据内容是否相同，而真实场景中通常要针对数据内容进行比对，这个API就是为这个场景而设计的。
 *
 * @memberOf module:_is
 * @param {Object | DataObject | DataArray} left 比对左值
 * @param {Object | DataObject | DataArray} right 比对右值
 * @returns {boolean} 不同返回 true，相同则返回 false
 */
const isDiff = (left, right) => {
    const leftValue = (left instanceof DataObject ||
        left instanceof DataArray) ? left.to() : left;
    const rightValue = (right instanceof DataObject ||
        right instanceof DataArray) ? right.to() : right;
    if (leftValue && rightValue) {
        const $left = Immutable.fromJS(left);
        const $right = Immutable.fromJS(right);
        return !Immutable.is($left, $right);
    } else return leftValue !== rightValue;
};

/**
 * ## 「标准」`Ux.isEmpty`
 *
 * 判断对象是否为空或 undefined，空包括 {}，以及[]。
 *
 * 1. 如果 undefined，则表示为空。
 * 2. 如果 Object，则判断它是否包含了键，无任何键则为空。
 * 3. 如果 Array，则判断长度是否为`0`，为0就表示空。
 *
 * @memberOf module:_is
 * @param {any} input 输入的数据内容
 * @returns {boolean} 如果为空返回 true，否则返回 false
 */
const isEmpty = (input) => {
    if (input) {
        if (U.isArray(input)) {
            return 0 === input.length;
        } else {
            return 0 === Object.keys(input).length;
        }
    } else return true; // undefined 也是 empty
};


/**
 * ## 「引擎」`Ux.isParent`
 *
 * 检查两个节点是否有父子关系，不传入 field 时，直接检查两个核心字段
 *
 * 1. 标准树专用字段：parent
 * 2. 非标准树的专用字段：parentId
 *
 * 由于是引擎函数，主键不可使用其他值，只能使用React中的通用主键`key`，为了兼容前端很多操作，Zero Ui中统一使用`key`字段
 * 作为元素、记录的唯一主键字段名，某些API可变更主键名，但大部分API（特别是引擎类）都直接使用key作主键。
 *
 * @memberOf module:_is
 * @param {Object} input 输入节点
 * @param {Object} parent 父节点
 * @param {String} field 固定字段检查
 * @return {boolean} 如果 input 的 parent 是 parent，那么为 true
 */
const isParent = (parent = {}, input, field) => {
    if (field) {
        return input[field] === parent.key;
    } else {
        if (input.parent) {
            return parent.key === input.parent;
        } else {
            return parent.key === input.parentId;
        }
    }
}


/**
 * ## 「标准」`Ux.isObject`
 *
 * 是否合法对象，合法对象的满足条件如下：
 *
 * 1. 如果是 undefined 则不是合法对象。
 * 2. 如果是 Object 还会排除 Array。
 *
 * 此处检查有一个和原始检查不同的点在于，检查过程中会排除Array类型，JavaScript中的Array
 * 也是一个合法的Object，排除的目的是程序过程中Array和Object的应用场景往往不同。
 *
 * @memberOf module:_is
 * @param {any} input 输入值
 * @returns {boolean} 如果是合法对象则为true，否则返回false
 */
const isObject = (input) => {
    if (input) {
        return !U.isArray(input) && U.isObject(input);
    } else return false;
};


/**
 * ## 「标准」`Ux.isIn`
 *
 * 判断当前元素是否存在于 Array 集合中，该API不支持对象数组，只支持纯值对应的数组，类似于集合中包含的数据检查。
 * 实际检查过程中类似调用了下边的两个API：
 *
 * 1. Ux.immutable：执行Immutable转换，调用内部API逻辑。
 * 2. contains：调用ImmutableJs中的原生API执行检查。
 *
 * > 该API仅针对Array的数据类型有效。
 *
 * @memberOf module:_is
 * @param {any} input 任意输入值
 * @param {Array} array 一个合法数组
 * @returns {boolean} 如果包含该元素返回true，否则返回false
 */
const isIn = (input, array = []) => {
    if (U.isArray(array)) {
        const $array = Immutable.fromJS(array);
        return $array.contains(input);
    } else return false;
};


/**
 * ## 「标准」`Ux.isFunction`
 *
 * 内部调用`underscore`，判断输入值是否是一个合法的 JavaScript 函数，原生调用为
 * Function.prototype.isPrototypeOf 的方式来判断。
 *
 * @memberOf module:_is
 * @param {any} input 传入值
 * @returns {boolean} 是函数返回true，不是函数返回false
 */
const isFunction = (input) => U.isFunction(input);


/**
 * ## 「标准」`Ux.isArray`
 *
 * 判断输入的值是否是一个合法的JavaScript中的Array类型。
 *
 * 内部调用`underscore`，判断输入值是否是一个合法 Array 的函数，在原生的JavaScript中通常使用
 * Array.prototype.isPrototypeOf 的方式来判断一个输入是否Array，而这个封装包含了特殊值的检测
 * 目前版本看起来走`underscore`的流程是最靠谱的。
 *
 * @memberOf module:_is
 * @param {any} input 输入值
 * @returns {boolean} 是数组则返回true，不是则返回false
 */
const isArray = (input) => U.isArray(input);


/**
 * ## 「引擎」`Ux.isQr`
 *
 * 判断输入的配置是否合法的带查询的结构，输入的 config 必须是合法的 Object
 *
 * ### 格式1
 *
 * ```json
 * {
 *     "ajax": {
 *         "magic":{
 *             "...": "< 合法可解析的查询条件模式 >"
 *         }
 *     }
 * }
 * ```
 *
 * ### 格式2
 *
 * ```json
 * {
 *     "params": {
 *          "criteria": {
 *              "...": "< 合法可解析的查询条件模式 >"
 *          }
 *     }
 * }
 * ```
 *
 * 该方法比较特殊，必须配合 Zero UI 中的查询引擎执行相关处理，主要用于判断查询参数
 * 所传入的对象必须包含以下路径下的值：
 *
 * ```shell
 * # 新格式，直接使用 ajax.magic
 * ajax.magic
 *
 * # 旧格式（最早的查询参数）直接使用 ajax.params.criteria
 * ajax.params.criteria
 * ```
 *
 * > 该API是为引擎中的查询引擎量身定制的函数，用于检查一个输入参数的配置是否符合查询引擎规范，
 * > 该检查在大部分`web`组件中会检查请求发送的参数格式，使用Adaptor的设计模式进行重新设计，如果
 * > 参数格式是 Qr 类型，那么会执行查询引擎的参数语法，如果不是 Qr 类型则直接使用原生数据类型。
 *
 * @memberOf module:_is
 * @param {Object} config 传入的配置信息
 * @returns {boolean} 如果合法则返回true，否则返回false
 */
const isQr = (config = {}) => {
    const ajaxRef = config.ajax;
    if (isObject(ajaxRef)) {
        if (ajaxRef.hasOwnProperty('magic')) {
            /*
             * 非查询引擎模式，直接配置
             * magic: {
             *
             * }
             */
            return false;
        } else {
            /*
             * 查询引擎模式，一般配置，必须包含
             * params.criteria: {
             *
             * }
             */
            if (ajaxRef.hasOwnProperty('params')) {
                if (isObject(ajaxRef.params)) {
                    return ajaxRef.params.hasOwnProperty('criteria');
                } else return false;
            } else return false;
        }
    } else {
        console.error(config);
        throw new Error("[ Ux ] 查询引擎方法不可调用于不带 ajax 配置的输入");
    }
};
/**
 * ## 「标准」`Ux.isCollection`
 *
 * 检查输入数据的类型是否一个合法的集合类型，集合类型包括：
 *
 * 1. Set：ES6中的集合类型。
 * 2. Array：标准的JavaScript中的数组Array类型。
 *
 * @memberOf module:_is
 * @param {any} input 传入部分的数据
 * @returns {boolean}
 */
const isCollection = (input) => (Set.prototype.isPrototypeOf(input) || isArray(input));
// ------------------------------- immutable.js -----------------------------

/**
 * ## 「标准」`Ux.clone`
 *
 * 该函数是一个高频使用函数，内置使用`Immutable`的API实现对象拷贝，拷贝对象分为以下几种场景：
 *
 * 1. 普通JS对象：Object/Array，直接调用`Immutable.fromJS.toJS`的链式调用实现对象拷贝。
 * 2. DataArray/DataObject：将这两种对象的内部内容拷贝出来，生成Object或Array。
 * 3. Function：（不拷贝），直接返回原始函数，防止函数拷贝过程中的错误信息。
 * 4. NodeList：Dom对象由于挂载在HTML元素中，所以不执行拷贝，而是直接返回该Dom引用。
 * 5. Set：如果是集合，则创建一个新的集合，将元素依次追加到集合中。
 * 6. Acl数组：对存在权限控制的Array/Object而言，它会包含一个索引之外的`__acl`属性，该属性存储了Acl的权限属性。
 *      1. 对Object类型而言，会直接拷贝__acl属性。
 *      2. 对Array类型，需要独立拷贝__acl属性（Immutable不会复制非索引访问的属性）。
 *
 * > 此处的JS应用了原型链，由于Array本身是一个Object，所以除了索引以外，可直接追加属性，只是这些属性不作为标准Array元素对待。
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
 * @param {DataObject | DataArray | Object | Array} input 传入合法对象，
 * @returns {any} 返回拷贝好的 Object
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
    } else if (U.isFunction(input)) {
        return input;
    } else {
        if (input) {
            if (Set.prototype.isPrototypeOf(input)) {
                const set = new Set();
                Array.from(input).forEach(item => set.add(item));
                return set;
            } else if (NodeList.prototype.isPrototypeOf(input)) {
                /*
                 * Html 部分直接返回原始集合，防止拷贝过程中拷贝了 Dom
                 */
                return input;
            } else {
                /*
                 * __acl copy for Array
                 */
                try {
                    const normalized = Immutable.fromJS(input).toJS();
                    if (isArray(input) && input.__acl) {
                        normalized.__acl = input.__acl;
                    }
                    return normalized;
                } catch (error) {
                    console.error(error, input);
                }
            }
        } else {
            return input;
        }
    }
};
/**
 * ## 「标准」`Ux.assign`
 *
 * 三种模式的拷贝函数，增强原始的`Object.assign`函数。
 *
 * * mode = 0 ：直接覆盖，内部调用`Object.assign`方法。
 * * mode = 1 ：深度覆盖，不直接覆盖子对象，递归往下，发现同键数据后直接覆盖数据。
 * * mode = 2 ：深度追加，不直接覆盖子对象，递归往下，同键不存在则追加，出现重复建则直接跳过。
 *
 * ```js
 * // mode = 0（默认模式）
 * const target = {
 *     name: "mode"
 * };
 * const source = {
 *     email: "lang.yu@hpe.com"
 * };
 *
 * // 等价于 Object.assign(target,source);
 * const combine = Ux.assign(target,source);
 *
 * // mode = 1 和 mode = 2 的模式则参考实际使用。
 * ```
 *
 * > 实际上mode为1或2的场景在很多实战场景中有所使用，这两种模式不会直接覆盖子对象（包括嵌套对象），而是通过比对的方式执行**覆盖**和**追加**（同名跳过）操作，实现深度合并。
 *
 *
 * @memberOf module:_primary
 * @param {Object} target 拷贝目标（副作用修改）
 * @param {Object} source 拷贝源
 * @param {Number} mode 模式参数，用于不同的模式：0 = 默认，1 = 深度覆盖，2 = 深度追加
 * @returns {Object} 合并好的JavaScript对象Object
 */
const assign = (target = {}, source = {}, mode = 0) => {
    if (!target) target = {};
    let result = clone(target);
    if (0 === mode) {
        result = Object.assign(target, source);
    } else {
        itObject(source, (field, value) => {
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
 * ## 「标准」`Ux.prevent`
 *
 * 特殊二义性函数「Ambiguity」，该函数的输入会有两种类型，其实第一种方式应用特别多：
 *
 * * 如果传入的是HTML中的`native`本地函数，通常在`Button`的onClick中会被传入。
 * * 如果传入的是Object数据，那么直接返回该Object数据。
 *
 * 这个函数读取数据有另外的一个API来实现`ambEvent`，所以这里只是为了执行单纯的方法，它执行的核心代码为`event.preventDefault()`。
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
 * @param {Event|Object} event 传入事件或对象
 * @return {Object} 返回对象信息
 */
const prevent = (event) => {
    /* 保证安全调用 */
    if (event && U.isFunction(event.preventDefault)) {
        event.preventDefault();
        return {};
    } else {
        /* 二义性，返回对应的Object值 */
        if (isObject(event)) {
            return event;
        } else return {};
    }
};
// ------------------------------- it.js -----------------------------

/**
 * ## 「标准」`Ux.itMatrix`
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
 * ## 「标准」`Ux.itObject`
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
    const iterator = clone(data);
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
 * ## 「引擎」`Ux.itUi`
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
 * ## 「引擎」`Ut.itRow`
 *
 * 1. 如果输入是 Array，则直接返回 Array。
 * 2. 如果输入的是 Object，则直接返回 object.items 数据，前提是 items 必须是 Array。
 *
 * @memberOf module:_it
 * @param {Array|Object} row 被遍历的行
 * @return {Array} 规范化过后的行相关信息
 */
const itRow = (row) => {
    if (isArray(row)) {
        return row;
    } else {
        return isArray(row['items']) ? row['items'] : [];
    }
};


/**
 * ## 「标准」`Ux.itElement`
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
 * ### 参数函数 itemFun
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
            if (isArray(item[field])) {
                item[field] = itElement(item[field], field, itemFun);
            } else {
                item[field] = itemFun(item[field], item);
            }
        }
    });
};


/**
 *
 * ## 「引擎」`Ux.itFull`
 *
 * `data` 中的每一个元素和 items 中的 `key = value` 构成一个条目，每个条目包含了三元操作数：
 * ( element, key, value ），执行前提是 key 和 value 都合法才执行。
 *
 * > 排除的 key, value 值包括 undefined、null、0 等所有无法通过JS判断的内容
 *
 * 特定场景代码参考下边片段：
 *
 * ```js
 const predicate = Abs.isFunction(fnPredicate) ? fnPredicate : () => true;
 Abs.itFull(array, object, (item = {}, key, value) => {
    if (predicate(value)) {
        fnExecute(item, key, value);
    }
});
 * ```
 *
 * ## 参数函数 fieldFun
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
 * ## 「标准」`Ux.itValue`
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
 * ### 参数函数 transformer
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
    if (U.isFunction(transformer) && isObject(object)) {
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
                        if (isObject(processed)) {
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
 * ## 「标准」`Ut.itTree`
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
    if (isFunction(executor)) {
        treeArray.forEach(item => {
            executor(item);
            if (item.children && 0 < item.children.length) {
                itTree(item.children, executor);
            }
        })
    }
};


/**
 * ## 「标准」`Ux.itAmb`
 *
 * 「Ambiguity」二义性函数，consumer 负责每一个元素的生成
 *
 * 1. 如果输入是 `Array` 则返回 `Array`。
 * 2. 如果输入是 `Object` 则返回 `Object`。
 *
 * 该方法会遍历Object或Array针对每一个键值对和元素执行`consumer`方法，并且返回执行结果。
 *
 * ```js
 *
 // 此处 room 可能是Array也可能是Object
 const calcRoomCheckIn = (reference, order = {}, room) => Ux.itAmb(room, (amb => {
    const {schedules = []} = order;
    const orders = [order];
    let $room = Ux.clone(amb);
    $room.leaving = true;
    $room.arriving = true;
    mountColor(reference, $room);
    mountOrder(orders, schedules, $room);
    mountOp(reference, $room);
    return $room;
}))
 * ```
 *
 * @memberOf module:_it
 * @param {Object/Array} input 二义性专用方法
 * @param {Function} consumer 执行函数
 * @return {Object/Array} 返回任意值
 */
const itAmb = (input, consumer) => {
    if (isFunction(consumer)) {
        if (isArray(input)) {
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
 * ## 「标准」`Ux.itRepeat`
 *
 * 重复执行多次的专用函数，第一参数为循环和迭代的次数。
 *
 * @memberOf module:_it
 * @param {Number} loop 循环的次数
 * @param {Function} consumer 每次循环执行的函数
 * @returns {Array} 返回每一次的返回值
 */
const itRepeat = (loop = 0, consumer) => {
    const rets = [];
    if (isFunction(consumer)) {
        for (let idx = 0; idx < loop; idx++) {
            rets.push(consumer(idx));
        }
    }
    return rets;
}
// ------------------------------- functions.js -----------------------------
const _generatorFn = (reference, names = []) => {
    const object = {};
    names.forEach(name => {
        object[name] = function () {
            let executor;
            if (reference.state) {
                executor = reference.state[name];
            }
            if (isFunction(executor)) {
                return executor.apply(null, arguments);
            } else {
                executor = reference.props[name];
                if (isFunction(executor)) {
                    return executor.apply(null, arguments);
                } else {
                    if (Cv.DEBUG) {
                        console.warn(`${name} function 不存在！`);
                    }
                }
            }
        }
    });
    return object;
};


/**
 * ## 「标准」`Ux.immutable`
 *
 * 直接调用 `immutable` 包中的 Immutable.fromJS 函数，生成 Immutable 对象，该对象包含了很多新的API，如常用的：
 *
 * * `getIn`：可直接使用`getIn(["field1","field11"])`读取嵌套属性。
 * * `setIn`：可使用`setIn(["field1","field11"])`设置嵌套属性。
 * * `contains`：高频使用方法，特别是Array模式，当然也可以直接使用ES6中的`Set.has`来判断。
 *
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
const immutable = (input) => Immutable.fromJS(input);
// eslint-disable-next-line
export default {
    /* 对象执行 */
    input,
    output,
    denull,
    slice,
    sequence,
    getV,
    /* 异步专用，p打头 */
    pass,
    promise,
    parallel,
    passion,
    packet,
    pipe,
    ready,
    debug,
    monad,

    prevent,
    // 拷贝对象
    clone,
    immutable,
    // 合并对象
    assign,
    /**
     * ## 「标准」`Ux.fn`
     *
     * Ux.fn(reference).xxx 方式调用函数，使用reference 构造对应的函数信息，需要注意的是：
     * 除了`onChange/onSelect`以外，其他所有函数都是以`rx`开始，`rx`在Zero Ui中的全称是：`Reactive X`，最初设计这种函数名的目的是区分
     * 不同的函数前缀，其中包括：
     *
     * |前缀|说明|
     * |---:|:---|
     * |on|HTML和Ant Design原生事件函数。|
     * |rx|自定义函数，Reactive X定义，Zero Ui专用函数。|
     * |fn|自定义纯函数，JavaScript Function对应的定义。|
     * |ix|「保留」内置专用函数，Internal X定义，Zero Ui保留的专用函数。|
     *
     * ### 1. 函数检索规则
     *
     * 1. 先从reference的state中读取对应函数，状态中的函数优先，和数据相反，状态中的函数有可能是在`componentDidMount`中定义的。
     * 2. 再从reference的props中读取函数。
     * 3. 如果都无法读取时则报错，该函数最终会返回函数引用。
     *
     * ### 2. 函数支持表
     *
     * |函数名|说明|
     * |---:|:---|
     * |onChange|原生HTML（包括AntD）常用的onChange方法。|
     * |onSelect|原生HTML（包括AntD）常用的onSelect方法。|
     * |rxSource|读取数据源的专用方法，组件中特定数据源的读取。|
     * |rxSubmit|提交函数。|
     * |rxClose|关闭函数。|
     * |rxFilter|过滤函数。|
     * |rxSelect|选择函数。|
     * |rxTree|树操作函数。|
     * |rxChild|绑定子组件专用函数。|
     * |rxCheck|选择函数，Checkbox专用。|
     * |rxClean|清除函数，清除选中状态专用。|
     * |rxDropOver|拖拽时触发的悬停覆盖函数。|
     * |rxBack|返回函数。|
     * |rxJumpPage|跳页函数。|
     * |rxNext|下一步函数。|
     * |rxNextPage|下一页函数。|
     * |rxPrev|上一步函数。|
     * |rxPrevPage|上一页函数。|
     * |rxFirst|第一步函数。|
     * |rxFirstPage|第一页函数。|
     * |rxLast|最后一步函数。|
     * |rxLastPage|最后一页函数。|
     * |rxAdd|添加函数。|
     * |rxEdit|编辑函数。|
     * |rxDelete|删除函数。|
     * |rxRefresh|更新函数。|
     * |rxItemAdd|子项添加函数。|
     * |rxItemEdit|子项编辑函数。|
     * |rxItemDelete|子项删除函数。|
     *
     * ### 3. 编辑器函数支持表
     *
     * |函数名|说明|
     * |---:|:---|
     * |rxRowAdd|行添加函数。|
     * |rxRowDel|行删除函数。|
     * |rxRowFill|行扩展函数。|
     * |rxRowCompress|行压缩函数。|
     * |rxRowWrap|行交换函数。|
     * |rxRowConfig|行配置函数，写入顶层raft。|
     * |rxCellAdd|单元格添加函数。|
     * |rxCellMerge|单元格合并函数。|
     * |rxCellDel|单元格删除函数。|
     * |rxCellSplit|单元格拆分函数。|
     * |rxCellFill|单元格填充函数。|
     * |rxCellWrap|单元格交换函数。|
     * |rxCellConfig|单元格配置函数。|
     * |rxCellRefresh|单元格刷新函数。|
     *
     * > `rx`系列函数是Zero Ui中的最终标准！！！
     *
     * @memberOf module:_primary
     * @param {reference} reference 传入部分的数据
     * @returns {Function} 返回生成的最终函数
     */
    fn: (reference) => _generatorFn(reference, [
        /* Ant 系列 */
        "onChange",      // 变更
        "onSelect",      // 选择

        /* Rx 系列 */
        "rxSource",      // 读取数据源
        "rxSubmit",      // 提交
        "rxClose",       // 关闭
        "rxFilter",      // 过滤
        "rxSelect",      // 选择
        "rxTree",        // 树操作
        "rxChild",       // 绑定子组件专用方法
        "rxCheck",       // 选中专用
        "rxClean",       // 清除专用
        /* Drop 和 Drag */
        "rxDropOver",    // 拖拽时放在上方

        /* rx特殊模式 */
        /* 页码处理专用 */
        "rxBack",        // 返回
        "rxJumpPage",    // 跳页
        "rxNext",        // 下一步
        "rxNextPage",    // 下一页
        "rxPrev",        // 上一步
        "rxPrevPage",    // 上一页
        "rxFirst",       // 第一步
        "rxLast",        // 最后一步
        "rxFirstPage",   // 第一页
        "rxLastPage",    // 最后一页

        /* 增删改 */
        "rxAdd",         // 添加
        "rxEdit",        // 编辑
        "rxDelete",      // 删除
        "rxRefresh",     // 刷新
        "rxItemEdit",    // 子项编辑
        "rxItemAdd",     // 子项添加
        "rxItemDelete",  // 子项删除


        /* Designer 系列 */
        "rxRowAdd",     // 添加行
        "rxRowDel",     // 删除行
        "rxRowFill",    // 行扩展
        "rxRowCompress",// 行压缩
        "rxRowWrap",    // 交换行
        "rxRowConfig",  // 行配置，写入顶层的 raft

        /* 单元格系列 */
        "rxCellAdd",    // 添加单元格
        "rxCellMerge",  // 合并单元格
        "rxCellDel",    // 删除单元格
        "rxCellSplit",  // 拆分单元格
        "rxCellFill",   // 填充单元格
        "rxCellWrap",   // 交换单元格
        "rxCellConfig", // 单元格配置
        "rxCellRefresh",// 单元格刷新，写入到顶层的 raft
    ]),
    /* 规则判断 */
    isRule,
    isRuleAll,
    isRuleAny,

    /* REG正则判断 */
    isCn,       /* REG: 中文 */
    isNumber,   /* REG: 合法整数 */
    isDecimal,  /* REG: 合法浮点数 */
    isCurrency, /* REG: 合法货币 */

    /* 复杂判断 */
    isObject,   /* 验证合法的对象 */

    isEmpty,
    /**
     * ## 「标准」`Ux.isNotEmpty`
     *
     * （略）`isEmpty`函数的逆函数，判断结果和`isEmpty`相反。
     *
     * @memberOf module:_is
     * @param {any} input 输入的数据内容
     * @returns {boolean} 如果为空返回 false，否则返回 true
     */
    isNotEmpty: (input) => !isEmpty(input),

    isDiff,
    /**
     * ## 「标准」`Ux.isSame`
     *
     * （略）`isDiff`函数的逆函数，判断结果和`isDiff`相反。
     *
     * @memberOf module:_is
     * @param {Object | DataObject | DataArray} left 比对左值
     * @param {Object | DataObject | DataArray} right 比对右值
     * @returns {boolean} 不同返回 false，相同则返回 true
     */
    isSame: (left, right) => !isDiff(left, right),


    isIn,       /* input 是否存在于 Array 中 */
    isParent,   /* 判断输入节点是否当前节点父节点 */

    /* underscore 连接 */
    isFunction,
    isArray,
    isCollection,
    isQr,       /* 配置是否查询引擎配置 */

    /* 遍历专用 */
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