import __Is from './fn.under.is.decision';
import __NAME from './__.v.silver.event.name';
import __Env from './v.environment';
import __AMB from './fn.assemble.amb.polysemy';

const __generatorFn = (reference, names = [], warning = true) => {
    const object = {};
    names.forEach(name => {
        object[name] = function () {
            let executor;
            if (reference.state) {
                executor = reference.state[name];
            }
            if (__Is.isFunction(executor)) {
                return executor.apply(null, arguments);
            } else {
                executor = reference.props[name];
                if (__Is.isFunction(executor)) {
                    return executor.apply(null, arguments);
                } else {
                    if (__Env.DEBUG && warning && !name.startsWith("do")) {
                        console.warn(`${name} function 不存在！`);
                    }
                }
            }
        }
    });
    // Reverted on `rx`
    const dynamic = {};
    if (reference.state) {
        Object.keys(reference.state)
            .filter(name => name.startsWith('rx'))
            .filter(name => !names.includes(name))
            .forEach(field => {
                const fnObj = reference.state[field];
                if (__Is.isFunction(fnObj)) {
                    dynamic[field] = fnObj;
                }
            });
    }
    if (reference.props) {
        Object.keys(reference.props)
            .filter(name => name.startsWith('rx'))
            .filter(name => !names.includes(name))
            .forEach(field => {
                const fnObj = reference.props[field];
                if (__Is.isFunction(fnObj) && !dynamic.hasOwnProperty(field)) {
                    dynamic[field] = fnObj;
                }
            });
    }
    if (!__Is.isEmpty(dynamic)) {
        Object.assign(object, dynamic);
    }
    return object;
};
const bind = (reference, inherit = {}, names = []) => {
    names.forEach(name => {
        const st1 = `on${name}`;
        /*
         * 状态优先考虑
         * 1. 先从 state 中提取 st1 的函数
         * 2. 无法提取则从 props 中提取 st1 的函数
         */
        let executor = __AMB.ambFn(reference, st1, false);
        if (!__Is.isFunction(executor)) {
            const nd2 = `on2${name}`;
            let executor2 = __AMB.ambFn(reference, nd2, false);
            if (__Is.isFunction(executor2)) {
                /*
                 * 高阶执行函数，最终 nd2 不挂载到 inherit 中
                 * 如果存在二阶函数，直接使用二阶函数生成一阶即可，主要处理绑定
                 */
                executor = executor2(reference);
            }
        }
        if (__Is.isFunction(executor)) {
            inherit[st1] = executor;
        }
    });
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    fn: (reference, warning = false) => __generatorFn(reference, __NAME, warning),
    bind
}