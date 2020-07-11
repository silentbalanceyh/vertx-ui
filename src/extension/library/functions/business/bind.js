import form from './object.form';
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
/**
 * ## 扩展函数
 *
 * 生成操作类专用函数执行器执行绑定。
 *
 * @memberOf module:_on
 * @param {ReactComponent} reference React对应组件引用
 * @param {Object} metadata 元数据配置信息
 * @returns {Function} 返回事件函数
 */
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