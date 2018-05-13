import Dg from './Ux.Debug'
import Validator from './Ux.Validator'
import Type from './Ux.Type';
import Html from './Ux.Html';
import Immutable from 'immutable';

const limitNumber = (length) => value => {
    if (value) {
        // 整数限制
        value = value.toString();
        if (1 === value.length) {
            value = value.replace(/[^1-9]/g, "");
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
        if (!item.optionJsx) item.optionJsx = {};
        // onFocus
        item.optionJsx.onFocus = Html.htmlErrorFocus(item);
        // onBlur
        item.optionJsx.onBlur = Html.htmlErrorBlur(item);
    }
};
/**
 * 处理当前Form中的input控件专用信息
 * @method extractForm
 * @param {React.PureComponent} reference React对应组件引用
 * @return {*}
 */
const extractForm = (reference = {}) => {
    const {$hoc} = reference.state;
    Dg.ensureNotNull($hoc);
    const form = $hoc._("form");
    Dg.ensureNotNull(form);
    if (form) {
        form.ui = Type.itMatrix(form.ui, (item) => Validator.mountValidator(reference, item));
        form.ui = Type.itMatrix(form.ui, (item) => mountNormalizer(reference, item));
        form.ui = Type.itMatrix(form.ui, (item) => mountErrorFocus(reference, item));
        return form.ui;
    } else {
        return [];
    }
};
/**
 * 处理当前Form中的button或操作按钮配置信息
 * @method extractOp
 * @param {React.PureComponent} reference React对应组件引用
 * @return {Array}
 */
const extractOp = (reference = {}) => {
    const {$hoc} = reference.state;
    Dg.ensureNotNull($hoc);
    const form = $hoc._("form");
    Dg.ensureNotNull(form);
    /**
     * 绑定Op专用，主要用于onClick的绑定操作
     */
    const {$op = {}} = reference.state;
    const opData = form && form.op ? Immutable.fromJS(form.op).toJS() : [];
    opData.forEach(op => {
        if (op.onClick && $op.hasOwnProperty(op.onClick)) {
            op.onClick = $op[op.onClick](reference);
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
const extractHidden = (reference = {}) => {
    const {$hoc} = reference.state;
    Dg.ensureNotNull($hoc);
    const form = $hoc._("form");
    Dg.ensureNotNull(form);
    const hidden = (form && form.hidden) ? form.hidden : {};
    if (!hidden.hasOwnProperty("op")) {
        hidden.op = false;
    }
    if (!hidden.hasOwnProperty('inputs')) {
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
    extractForm,
    extractHidden,
    extractOp
}
