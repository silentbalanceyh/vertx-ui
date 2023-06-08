import __E from './fn.debug.fx.error';
import __Is from './fn.under.is.decision';
import __A from './fn.atomic.foundation';

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
        if (__Is.isFunction(supplier)) {
            const promise = supplier(params);
            if (promise instanceof Promise) {
                return promise;
            } else {
                return __E.fxReject;
            }
        } else {
            return __E.fxReject;
        }
    } else if (3 === arguments.length) {
        const state = arguments[0];
        const key = arguments[1];
        state[key] = arguments[2];
        return promise(state);
    } else {
        return __E.fxReject;
    }
}

function parallel(promises = [], ...keys) {
    if (0 === keys.length) {
        /*
         * 直接返回 all
         */
        return Promise.all(promises)
            .catch(error => console.error(error));
    } else {
        /*
         * 返回 处理结果
         */
        const args = [];
        keys.forEach(key => args.push(key));
        return Promise.all(promises).then(response => {
            const result = {};
            response.forEach((item, index) => {
                const key = args[index] ? args[index] : index;
                if (__Is.isObject(item) || __Is.isArray(item)) {
                    result[key] = __A.clone(item);
                } else {
                    result[key] = item;
                }
            });
            return promise(result);
        }).catch(error => console.error(error));
    }
}

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
//
// function pipe() {
//     if (1 === arguments.length) {
//         const input = arguments[0];
//         if (input) {
//             if (__Is.isFunction(input.setState)) {
//                 // 解决异步处理Bug
//                 return state => {
//                     console.log(state);
//                     return new Promise((resolve) => {
//                         input.setState(state, () => {
//                             resolve(input.state);
//                         });
//                     })
//                 }
//                 // {
//                 //     try {
//                 //         input.setState(state);
//                 //     } catch (error) {
//                 //     }
//                 //     return promise(state);
//                 // }
//             } else {
//                 console.error("[ Ux ] 必须传入 reference 变量，当前不合法", input);
//             }
//         } else {
//             throw new Error("[ Ux ] pipe 方法为特殊方法，必须保证参数，当前参数不存在！");
//         }
//     } else {
//         throw new Error("[ Ux ] pipe 方法参数长度不对！");
//     }
// }

const ready = (state = {}) => {
    state.$ready = true;
    return promise(state);
};
const pipe = (reference) => (state) => {
    // End 部分
    reference.setState(state);
}
const pipeOr = (reference) => (state) => new Promise((resolve) => {
    reference.setState(state, () => {
        resolve(state);
    });
})

const pass = (executor, response) => {
    // 优先判断是否函数执行
    let ret;
    if (__Is.isFunction(executor)) {
        ret = executor();
    } else if (executor instanceof Promise) {
        ret = executor;
    } else {
        ret = promise(response);
    }
    return ret;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    promise,    // f-define
    pass,
    parallel,   // f-define
    passion,
    pipe,       // f-define
    pipeOr,     // 中间处理
    ready,
}