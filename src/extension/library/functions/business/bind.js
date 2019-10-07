import form from './form';
import U from 'underscore';
/*
 * 注意这里全部要使用三阶函数
 */
const FUNS = {
    "event.filter": () => reference => params =>
        form(reference).filter(params),
    "event.add": (config = {}) => reference => params =>
        form(reference).add(params, config),
    "event.save": (config = {}) => reference => params =>
        form(reference).save(params, config),
    "event.delete": (config = {}) => reference => params =>
        form(reference).remove(params, config)
};
const onOp = (reference, metadata = {}) => {
    const {event = "", config = {}} = metadata;
    const executor = FUNS[event];
    if (U.isFunction(executor)) {
        return executor(config);
    } else {
        console.error("[ Ex ] 对不起，事件无法绑定！", event);
    }
};

export default {
    onOp,
}