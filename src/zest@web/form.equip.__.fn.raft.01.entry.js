import __Zn from './zero.module.dependency';
import __AI_UI from './form.__.fn.ai.ui.equip';
import __AI_IT from './form.__.fn.it.ui.analyze';
import {_Logger} from 'zo';
import {Form} from 'antd';
// Unlock for DialogEditor
// Old -> import UcaField from "./variant-uca";
import UcaField from "./variant-uca/render.__.ai.hidden";

const raftAttribute = (raft = {}, params = {}) => {
    const {form = {}, addOn = {}} = params;
    /*
     * 1. 布局参数 window
     * 2. 基本配置合并
     */
    const window = form.window ? form.window : 1;
    const $rest = __Zn.clone(addOn);
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
        // ?eb-form -> ux_form
        className = `ux_form ${className}`;
    } else {
        // 其次是配置模式
        // ?eb-form -> ux_form
        className = form.className ? form.className : 'ux_form';
    }
    raft.form.className = className;


    raft.options = config;
    Object.freeze(raft.options);    // 只读
    // 打印表单中的核心日志
    _Logger.render(1, config, addOn.id);
};

const raftHidden = (raft = {}, $form, reference) => {
    /*
     * hidden 默认值
     */
    if (__Zn.isArray($form.hidden)) {
        raft.hidden = [];
        $form.hidden.forEach(field => {
            const hidden = {};
            const jsx = {name: field, key: field};
            /*
             * 此处使用软判断，查询 reference 中是否包含 formRef（常用表单专用操作）
             * 包含了 formRef 就处理 form 变量，不包含的时候就走常用流程，既不违背原始
             * 操作集，也不会破坏带有 <Form/> 的Ant Design新流程。
             */
            if (reference.hasOwnProperty("formRef")) {
                // Form.Item模式
                hidden.render = (values) => {
                    // Ant 4.0
                    const attrs = __Zn.v4FormHidden(reference, field, values);
                    return (
                        <Form.Item {...attrs}>
                            {UcaField.aiHidden(reference, jsx)}
                        </Form.Item>
                    )
                }
            } else {
                // 普通模式
                hidden.render = UcaField.aiHidden(reference, jsx);
            }
            /*
             * 新版本中，此处不需要做相关判断
            // const form = __Zn.v4FormRef(reference);
            // const {form} = reference.props;
            const [form] = Form.useForm();
            console.log(form, reference);
            if (form) {
                // Hidden 无所谓，不可能会触发相关操作
                // const {?etFieldDecorator} = form;
                hidden.render = (values = {}) => {
                    // Ant 4.0
                    const attrs = __Zn.v4FormHidden(reference, field);
                    console.warn(attrs);
                    return (
                        <Form.Item {...attrs}>
                            {UcaField.aiHidden(reference, {name: field, key: field})}
                        </Form.Item>
                    )
                    // return ?etFieldDecorator(field, {
                    //     initialValue
                    // })(UcaField.aiHidden(reference, {name: field, key: field}))
                };
            } else {
                hidden.render = UcaField.aiHidden(reference, {name: field, key: field});
            }
             */
            raft.hidden.push(hidden);
        })
    }
};
/*
 * 新版触发机制会牵涉到反向原则，针对这种情况，需要重新计算一次所有的ui，这个方法主要针对如下配置：
 *
 * optionJsx.depend.enabled / optionJsx.config.impact 的协同，简单说就是所有出现在 depend 中的字段
 * 需要归并到其反向字段对应的 optionJsx.config.impact 中去实现反向触发计算，解决onChange的级联问题，
 * 级联问题在 AntD 中没有自带。
 * Fix: https://e.gitee.com/wei-code/issues/table?issue=I7237H
 *
 * 1. optionJsx.depend.enabled 处理
 * 2. optionJsx.config.cascade 处理
 */
const _raftDepend = (ui = [], reference) => {
    const impactMap = {};
    __Zn.itMatrix(ui, item => {
        if (item.optionJsx) {
            const {depend = {}, config = {}} = item.optionJsx;
            const {enabled} = depend;
            if (enabled) {
                Object.keys(enabled).forEach(field => {
                    if (!__Zn.isArray(impactMap[field])) {
                        impactMap[field] = [];
                    }
                    impactMap[field].push(item.field);
                })
            }
            if (config.cascade) {
                const field = config.cascade.source;
                if (!__Zn.isArray(impactMap[field])) {
                    impactMap[field] = [];
                }
                impactMap[field].push(item.field);
            }
        }
    })
    // 注入 optionJsx.impact
    __Zn.itMatrix(ui, item => {
        if (impactMap.hasOwnProperty(item.field)) {
            // 注入 impact
            if (!item.optionJsx) item.optionJsx = {};
            const {depend = {}} = item.optionJsx;
            const {impact = {}} = depend;
            if (__Zn.isArray(impact.reset)) {
                impact.reset = impact.reset.concat(impactMap[item.field]);
            } else {
                impact.reset = impactMap[item.field];
            }
            depend.impact = impact;
            item.optionJsx.depend = depend;
        }
    });
}

const raftUi = (reference = {}, ui = [], rule = {}) => {
    // 解析 Title
    ui = __AI_IT.itUi(ui, __Zn.aiExprTitle);
    // 解析 Subject
    ui = __AI_IT.itUi(ui, __Zn.aiExprSubject);
    // 解析 field
    ui = __AI_IT.itUi(ui, __Zn.aiExprField, __Zn.aiExprFieldEx);
    // 先处理onFocus,onBlur，在hooker中会被删除掉
    ui = __Zn.itMatrix(ui, item => __AI_UI.aiErrorFocus(reference, item));
    // 挂载验证器，处理 rules
    ui = __Zn.itMatrix(ui, item => __AI_UI.aiValidation(reference, item));
    // 挂载 normalizer
    ui = __Zn.itMatrix(ui, item => __AI_UI.aiNormalizer(reference, item));
    // 挂载 rule
    __Zn.itMatrix(ui, item => __AI_UI.aiRule(rule, item));
    // 挂载 depend
    _raftDepend(ui, reference);
    return ui;
};

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
    const adjustCol = __Zn.aiLayoutAdjust(options.window);
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
    // Render-01: 基本信息
    raftAttribute,
    // Render-02: <Input type="hidden"/>
    raftHidden,
    // Render-03：计算 form.ui
    raftUi,
    // Render-4：计算布局相关信息
    raftLayout,
}