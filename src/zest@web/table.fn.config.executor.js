import __Zn from './zero.module.dependency';

const configExecutor = (reference, executors) => {
    /*
     * 基本规范，executor 必须是 fn 打头的
     */
    const events = {};
    Object.keys(executors)
        .filter(key => key.startsWith('fn'))
        .filter(key => __Zn.isFunction(executors[key]))
        .forEach(key => events[key] = executors[key]);
    let executor = __Zn.clone(events);
    const {$executor = {}} = reference.props;
    if (!__Zn.isEmpty($executor)) {
        /*
         * 如果 $executor 中包含了 fnEdit / fnDelete 会被覆盖掉
         */
        Object.assign(executor, $executor);
    }
    return executor;
};
const configExecutors = (reference, executors) => {
    const events = {};
    Object.keys(executors)
        .filter(key => __Zn.isFunction(executors[key]))
        .forEach(key => {
            const target = executors[key](reference);
            if (__Zn.isFunction(target)) {
                events[key] = target;
            }
        });
    return events;
}
export default {
    configExecutor,
    configExecutors
}