import Validator from "./Ux.Validator";
import Type from "./Ux.Type";
import Html from "./Ux.Html";
import E from "./Ux.Error";
import Immutable from "immutable";
import Ai from "./ai/AI";

const limitNumber = length => value => {
    if (value) {
        // 整数限制
        value = value.toString();
        if (1 === value.length) {
            value = value.replace(/[^0-9]/g, "");
        } else {
            value = value.replace(/\D/g, "");
        }
        // 长度限制
        if (0 < length) {
            if (length < value.length) {
                value = value.substring(0, length);
            }
        }
    }
    return value;
};
const limitDecimal = (length, scale = 2) => value => {
    if (value) {
        // 2.正数输入限制
        value = value.toString();
        value = value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
        value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        value = value
            .replace(".", "$#$")
            .replace(/\./g, "")
            .replace("$#$", ".");
        const scaleReg = new RegExp(`(\\-)*(\\d+)\\.(\\d{${scale}}).`);
        value = value.replace(scaleReg, `$1$2.$3`); //只能输入两个小数
        // 3.长度输入限制
        if (length < value.length) {
            value = value.substring(0, length);
        }
        return value;
    }
    return value;
};
const normalizer = {
    decimal: limitDecimal,
    number: limitNumber
};
const mountNormalizer = (reference, item = {}) => {
    if (item.optionConfig && item.optionConfig.normalize) {
        const expr = item.optionConfig.normalize;
        if (expr) {
            const segments = expr.toString().split(",");
            if (1 < segments.length) {
                // 读取类型
                const type = segments[0];
                const executor = normalizer[type];
                if (executor) {
                    // 参数准备
                    const args = [];
                    for (let idx = 1; idx < segments.length; idx++) {
                        args.push(segments[idx]);
                    }
                    // 函数调用
                    const jFun = executor.apply(null, args);
                    if (jFun) {
                        item.optionConfig.normalize = jFun;
                    }
                }
            }
        }
    }
};
const mountErrorFocus = (reference, item) => {
    if (item.field) {
        if (item.optionConfig && item.optionConfig.hasOwnProperty("rules")) {
            if (!item.optionJsx) item.optionJsx = {};
            // onFocus
            item.optionJsx.onFocus = Html.htmlErrorFocus(item);
            // onBlur
            item.optionJsx.onBlur = Html.htmlErrorBlur(item);
        }
    }
};

const _normalizeUi = (reference, ui = []) => {
    // 最开始使用属性解析器解析配置信息，先做解析
    ui = Ai.hookerForm(ui);
    // 先处理onFocus,onBlur，在hooker中会被删除掉
    ui = Type.itMatrix(ui, item => mountErrorFocus(reference, item));
    // 挂载验证器，处理rules
    ui = Type.itMatrix(ui, item => Validator.mountValidator(reference, item));
    // 挂载normalize专用
    ui = Type.itMatrix(ui, item => mountNormalizer(reference, item));

    return ui;
};
/**
 * 处理当前Form中的input控件专用信息
 * @method extractForm
 * @param {React.PureComponent} reference React对应组件引用
 * @param key 读取的配置值
 * @return {*}
 */
const extractForm = (reference = {}, key = "form") => {
    const { $hoc } = reference.state;
    E.fxTerminal(!$hoc, 10062, $hoc);
    const form = $hoc._(key);
    E.fxTerminal(!form, 10056, $hoc);
    return form ? _normalizeUi(reference, form.ui) : [];
};
/**
 * 分组处理Form中的input控件专用
 * @method extractGroupForm
 * @param {React.PureComponent} reference React对应组件引用
 * @param groupIndex 组对应的索引值
 */
const extractGroupForm = (reference = {}, groupIndex, key = "form") => {
    if (undefined !== groupIndex) {
        const { $hoc } = reference.state;
        E.fxTerminal(!$hoc, 10062, $hoc);
        const form = $hoc._(key);
        E.fxTerminal(!form, 10056, $hoc);
        return form && form.ui[groupIndex]
            ? _normalizeUi(reference, form.ui[groupIndex])
            : [];
    } else {
        E.fxTerminal(true, 10036, groupIndex);
    }
};
/**
 * 处理当前Form中的button或操作按钮配置信息
 * @method extractOp
 * @param {React.PureComponent} reference React对应组件引用
 * @param op 操作事件集
 * @return {Array}
 */
const extractOp = (reference = {}, op, key = "form") => {
    const { $hoc } = reference.state;
    E.fxTerminal(!$hoc, 10062, $hoc);
    const form = $hoc._(key);
    E.fxTerminal(!form, 10056, $hoc);
    /**
     * 绑定Op专用，主要用于onClick的绑定操作
     */
    let source = op ? op : reference.state["$op"];
    if (!source) source = {};
    const opData = form && form.op ? Immutable.fromJS(form.op).toJS() : [];
    opData.forEach(op => {
        if (op.onClick && source.hasOwnProperty(op.onClick)) {
            op.onClick = source[op.onClick](reference);
            if (source.$loading) {
                // 防重复提交专用效果
                op.loading = source.$loading;
            }
        }
    });
    return opData;
};
/**
 * 处理type = hidden类型的配置信息
 * @method extractHidden
 * @param {React.PureComponent} reference React对应组件引用
 * @return {{}}
 */
const extractHidden = (reference = {}, key = "form") => {
    const { $hoc } = reference.state;
    E.fxTerminal(!$hoc, 10062, $hoc);
    const form = $hoc._(key);
    E.fxTerminal(!form, 10056, $hoc);
    const hidden = form && form.hidden ? form.hidden : {};
    if (!hidden.hasOwnProperty("op")) {
        hidden.op = false;
    }
    if (!hidden.hasOwnProperty("inputs")) {
        hidden.inputs = [];
    }
    return hidden;
};
/**
 * @class Normalize
 * @description 专用Form配置处理类，它的方法大部分都是内部使用
 */
export default {
    // 读取Form配置专用方法
    extractGroupForm,
    extractForm,
    extractHidden,
    extractOp,
    // Ui处理
    raftUi: _normalizeUi
};
