import EVENT_ACTION from './variant-form';
import __Zn from './zero.module.dependency';

const Cv = __Zn.Env;

const __raftEvent = (config = {}, reference, eventName = 'onClick') => {
    const eventFun = EVENT_ACTION[config.event];
    if (__Zn.isFunction(eventFun)) {
        const onEvent = eventFun(reference, config);
        /*
         * 权限限制处理，后期引入表单级别的权限控制
         */
        if (__Zn.isFunction(onEvent)) {
            config[eventName] = onEvent;
        } else {
            config[eventName] = () =>
                console.error(`[ Ux ] 找到的事件 key = ${config.event} 不是一个高阶函数，无法生成最终事件`);
        }
    } else {
        config[eventName] = () =>
            console.error(`[ Ux ] 无法找到对应的事件信息，key = ${config.event}`, EVENT_ACTION);
    }
};
const __raftActionReset = (reference, expr = "") => {
    const reset = __Zn.aiExprOp(expr);
    reset.type = "default";
    reset.event = Cv.TYPE_EVENT.RESET;
    __raftEvent(reset, reference);
    // Object.freeze(reset);
    return reset;
};
const __raftActionSubmit = (reference, expr = "") => {
    const item = __Zn.aiExprOp(expr);
    item.type = "primary";
    item.event = Cv.TYPE_EVENT.SUBMIT;
    __raftEvent(item, reference);
    return item;
};
const __raftActionUniform = (reference, expr = "") => {
    const item = __Zn.aiExprOp(expr);
    __raftEvent(item, reference);
    // Object.freeze(item);
    return item;
};
const __raftButtons = (reference, jsx) => {
    const buttons = jsx.buttons;
    __Zn.fxTerminal(!buttons.hasOwnProperty('submit'), 10074, 'submit');
    const normalized = [];
    // 提交按钮解析
    const item = __raftActionSubmit(reference, buttons.submit);
    normalized.push(item);
    if (buttons.reset) {
        // 重置按钮属性
        const reset = __raftActionReset(reference, buttons.reset);
        normalized.push(reset);
    }
    return normalized;
};
const __raftExtensions = (reference, jsx) => {
    const extension = jsx.extension;
    const normalized = [];
    if (__Zn.isArray(extension)) {
        extension.map(each => __raftActionUniform(reference, each))
            .filter(each => undefined !== each)
            .forEach(each => normalized.push(each));
    }
    return normalized;
};
const raftAction = (cell = {}, reference) => {
    /*
     * 显示隐藏的基本处理
     */
    if (!cell.optionJsx) cell.optionJsx = {};
    cell.optionJsx.hidden = !!cell.hidden;
    /*
     * 进行分流解析
     */
    const jsxRef = cell.optionJsx;
    if (jsxRef.buttons) {
        // submit + reset 双按钮
        return __raftButtons(reference, jsxRef);
    } else if (jsxRef.extension) {
        /*
         * extension 多按钮模式，新模式
         * 带权限控制
         */
        return __raftExtensions(reference, jsxRef);
    } else {
        // 非法
        console.error(cell);
        throw new Error("无法渲染的按钮！")
    }
};
export default {
    raftAction,
}