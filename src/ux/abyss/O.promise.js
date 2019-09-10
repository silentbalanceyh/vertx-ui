/*
 * 单参数
 * 1）直接返回 Promise（新规范）
 * 双参数
 * 2）第一个为 Function，( supplier, params )
 * 三参数
 * 3）做合并
 */
import U from "underscore";
import E from '../error';
import V from './O.immutable';
import Q from 'q';

function promise() {
    if (1 === arguments.length) {
        const value = arguments[0];
        return new Promise(resolve => resolve(value));
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

function parallel(promises = [], ...keys) {
    if (1 === arguments.length && U.isArray(arguments[0])) {
        /*
         * 直接返回 Q.all
         */
        return Q.all(promises);
    } else {
        /*
         * 返回 处理结果
         */
        return Q.all(promises)
            .then(response => {
                const result = {};
                response.forEach((item, index) => {
                    const key = keys[index];
                    if (keys) {
                        result[key] = V.clone(item);
                    }
                });
                return promise(result);
            });
    }
}

/*
 * 按顺序执行时，
 * 1）数组中的每个元素必须是一个 generator（调用一次过后可直接生成 Promise），生成参数是 input
 * 2）第一个 generator 生成完成过后，得到的结果会递交给 第二个 generator 直到最后一个执行
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

/*
 * 二义性 promise 调试函数
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

export default {
    promise,
    parallel,
    passion,
    debug
}