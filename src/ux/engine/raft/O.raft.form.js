// 导入当前目录
import Expr from '../expression';
// 导入外层
import Abs from '../../abyss';
import Grid from '../layout';
import Develop from '../../develop';
import Ut from "../../unity";
import VALIDATORS from "../validator";
import E from "../../error";
import Normalizer from "./O.raft.normalizer";

const {Logger: Log} = Develop;
/*
 * 表单内部
 */
const aiErrorFocus = (reference, item) => {
    if (item.field) {
        if (item.optionConfig && item.optionConfig.hasOwnProperty("rules")) {
            if (!item.optionJsx) item.optionJsx = {};
            // onFocus
            item.optionJsx.onFocus = Ut.htmlErrorFocus(item);
            // onBlur
            item.optionJsx.onBlur = Ut.htmlErrorBlur(item);
        }
    }
}
const aiValidator = (reference = {}, item = {}) => {
    if (item.optionConfig) {
        const rules = item.optionConfig.rules;
        // 触发条件设置，默认onBlur，符合大多数习惯
        if (!item.optionConfig.hasOwnProperty("validateTrigger")) {
            item.optionConfig.validateTrigger = "onBlur";
        }
        if (rules && Array.prototype.isPrototypeOf(rules)) {
            rules.forEach(rule => {
                if (rule.validator && !Abs.isFunction(rule.validator)) {

                    // 合并处理（可覆盖）
                    const inputValidator = Abs.pass(reference, '$validator');
                    const validators = Abs.clone(VALIDATORS);
                    Object.assign(validators, inputValidator);

                    // 处理条件
                    const executeFun = validators[rule.validator];
                    // 10023
                    E.fxTerminal(!Abs.isFunction(executeFun), 10023, rule.validator, Object.keys(validators));
                    if (Abs.isFunction(executeFun)) {
                        // supplier 处理
                        const validatorFun = executeFun(reference, item.optionJsx);
                        // 10024
                        E.fxTerminal(!Abs.isFunction(validatorFun), 10024, Abs.isFunction(validatorFun));
                        if (Abs.isFunction(validatorFun)) {
                            rule.validator = validatorFun;
                        }
                    }
                }
            });
        }
    }
};
const aiNormalizer = (reference, item = {}) => {
    if (item.optionConfig && item.optionConfig.normalize) {
        const expr = item.optionConfig.normalize;
        if (expr) {
            const segments = expr.toString().split(",");
            if (1 <= segments.length) {
                // 读取类型
                const type = segments[0];
                const executor = Normalizer[type];
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
                } else {
                    console.error("[ Ux ] normalize 属性解析失败：", expr, item);
                }
            }
        }
    }
}

const aiRule = (rule, item) => {
    if (Abs.isNotEmpty(rule)) {
        if (item.optionJsx && rule.hasOwnProperty(item.field)) {
            // 构造 config
            if (!item.optionJsx.config) {
                item.optionJsx.config = {}
            }
            // 合并 linker，追加 seeking
            const configRef = item.optionJsx.config;
            const ruleConfig = rule[item.field]
            if (ruleConfig.linker) {
                if (!configRef.linker) {
                    configRef.linker = {}
                }
                Object.assign(configRef.linker, ruleConfig.linker);
            }

            // 合并 seeking
            if (ruleConfig.seeking) {
                configRef.seeking = ruleConfig.seeking;
            }
            // TODO:
            // 合并 optionJsx.depend
            // 合并 optionJsx.impact
        }
    }
}

const raftUi = (reference = {}, ui = [], rule = {}) => {
    // 解析 Title
    ui = Abs.itUi(ui, Expr.aiExprTitle);
    // 解析 field
    ui = Abs.itUi(ui, Expr.aiExprField, Expr.aiExprFieldEx);
    // 先处理onFocus,onBlur，在hooker中会被删除掉
    ui = Abs.itMatrix(ui, item => aiErrorFocus(reference, item));
    // 挂载验证器，处理 rules
    ui = Abs.itMatrix(ui, item => aiValidator(reference, item));
    // 挂载 normalizer
    ui = Abs.itMatrix(ui, item => aiNormalizer(reference, item));
    // 挂载 rule
    Abs.itMatrix(ui, item => aiRule(rule, item))
    return ui;
};
/*
 * 构造Form的基本属性信息
 */
const raftAttribute = (raft = {}, params = {}) => {
    const {form = {}, addOn = {}} = params;
    /*
     * 1. 布局参数 window
     * 2. 基本配置合并
     */
    const window = form.window ? form.window : 1;
    const $rest = Abs.clone(addOn);
    const config = window ? {...$rest, window} : $rest;
    /*
     * ！！！raft 中必须包含 form 的 key
     */
    raft.form.layout = form.layout ? form.layout : "inline";


    /*
     * ！！！计算表单中的 className 属性
     * 两种模式只能二选一，不可合并
     */
    const {reference} = addOn;
    let {className} = reference ? reference.props : "";
    if (className) {
        // 编程模式优先
        className = `web-form ${className}`;
    } else {
        // 其次是配置模式
        className = form.className ? form.className : 'web-form';
    }
    raft.form.className = className;


    raft.options = config;
    Object.freeze(raft.options);    // 只读
    Log.render(1, config, addOn.id);
};
/*
 * 计算整体布局信息
 */
const raftLayout = (raft = {}, params = {}) => {
    const {form = {}, addOn = {}} = params;
    const {options = {}} = form;
    const calculated = {};
    /*
     * 计算
     * span：默认的 span，根据列执行计算
     * spans：所有的 spans 信息（错位布局信息）
     */
    const {columns = 4} = addOn;  // 最终以此处的 columns 为主
    calculated.span = 24 / columns;
    const adjustCol = Grid.aiAdjust(options.window);
    if (adjustCol && adjustCol.row) {
        calculated.spans = adjustCol.row[columns];
    }
    /*
     * 计算
     * rowConfig：行特殊配置
     * rowClass：行对应的 css
     */
    calculated.rowConfig = form.rowConfig ? form.rowConfig : {};
    calculated.rowClass = form.rowClass ? form.rowConfig : {};
    /*
     * 动态表单专用
     */
    calculated.entity = addOn.entity;
    return calculated;
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    raftRule: (reference, item = {}) => {
        const ruleItem = Abs.clone(item);
        aiErrorFocus(reference, ruleItem);
        aiValidator(reference, ruleItem);
        aiNormalizer(reference, ruleItem);
        return ruleItem;
    },
    raftAttribute,
    raftUi,
    raftLayout
}