import E from "../error";
import U from "underscore";
import Abs from '../abyss';

/**
 * 窗口onOk连接在函数，连接Html元素并设置onOk的触发器
 * @method connectButton
 * @param dialog 传入的dialog窗口配置
 */
const connectButton = (dialog = {}) => {
    if ("string" === typeof dialog.onOk) {
        // 防止引用切换，必须使用Immutable
        const key = Abs.clone(dialog);
        // Monitor连接部分代码
        dialog.onOk = () => connectId(key.onOk);
    } else {
        // 防重复注入
        E.fxWarning(!U.isFunction(dialog.onOk), 10016, dialog.onOk);
    }
};

/**
 * 链接某个ID的元素
 * @param id
 */
function connectId(id) {
    const ele = document.getElementById(id);
    E.fxWarning(!ele, 10015, id);
    if (ele) {
        ele.click();
    }
}

/*
 * validation的专用
 * 针对 rules 的规则处理
 */
const connectValidator = (cell = {}) => {
    /*
     * 需要自动切换配置的地方，从 onBlur 切换到 onChange
     */
    const onValidate = Abs.immutable([
        "aiSelect",
        "aiListSelector",
        "aiTreeSelect"
    ]);
    const optionConfig = Abs.clone(cell.optionConfig);
    const {optionJsx = {}} = cell;
    /*
     * 是否禁用
     */
    const disabled = optionJsx.disabled;
    if (disabled) {
        /*
         * 禁用时删除所有验证
         */
        if (optionConfig.rules) {
            delete optionConfig.rules;
        }
    } else {
        /*
         * 解决特殊验证控件的触发事件，保证验证结果
         * 未禁用时开验证
         */
        if (optionConfig.rules && onValidate.contains(cell.render)) {
            /*
             * 即使配置了也需要更改
             */
            optionConfig.validateTrigger = "onChange";
        }
    }
    return optionConfig;
};
export default {
    /*
     * 连接 Button，Id
     * 连接 Validator 中的 rules 通用处理
     */
    connectButton,
    connectId,
    connectValidator,
};