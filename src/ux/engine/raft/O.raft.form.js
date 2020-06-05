// 导入当前目录
import Expr from '../expression';
// 导入外层
import Abs from '../../abyss';
import Grid from '../layout';
import Log from '../../develop/logger';
/*
 * 表单内部
 */
import aiErrorFocus from './I.fn.html';
import aiValidator from './I.fn.validator';
import aiNormalizer from './I.fn.normalizer';

const raftUi = (reference = {}, ui = []) => {
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
    raft.form.className = form.className ? form.className : "web-form";
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