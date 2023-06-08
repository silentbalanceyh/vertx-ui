import __Zn from './zero.module.dependency';
import __TIP from './ask.__.fn.ai.tips.element';
import __FT from './form.fn.connect.trigger';
import {Col, Form, Row} from "antd";
import React from "react";

const Fm = {
    ...__TIP,
}

const __aiInput = (reference, values) => (cell = {}) => {
    if (cell.title) {
        // title 渲染
        return Fm.aiTitle(reference, cell);
    } else if (cell.subject) {
        // subject 渲染
        return Fm.aiSubject(reference, cell);
    } else {
        /*
         * 检测 __render 值，特殊的验证效果处理
         * 设置特殊的验证效果，主要是非输入型组件的验证效果专用处理
         * 追加 ux_form-has-error 类名，保证验证时的提示处理
         *
         * 新版在 render 内部执行计算，并且将 Form.Item 转移到内部
         * 由于新版的很多内容都已经和原始计算不相同，在内部计算更能将核心
         * 计算处理得更加得心应手，所以将两块：
         * 1. Form.Item 的计算
         * 2. render(reference, jsx) 转移到内部
         *
         * 并且需要重构计算顺序来完成整体计算法则，因此表单引擎
         * 开始处理新模式
         * */
        const colAttrs = __FT.connectItem(cell);
        return (
            <Col {...colAttrs}>
                {cell.render ? cell.render(values, cell, reference) : false}
            </Col>
        )
    }
};
const aiField = (reference, values = {}, raft = {}) =>
    (__Zn.isArray(raft.rows)) ? raft.rows.map((row) => {
        const {cells = [], ...rest} = row;
        return (
            <Row {...rest}>
                {/* 单元格 */}
                {cells.map(__aiInput(reference, values))}
            </Row>
        )
    }) : false;
const aiFormInput = (reference, values, raft = {}) => {
    /*
     * 初始值 initial 优先
     */
    let initials = __Zn.xtInited(reference, values);
    const {form = {}} = raft;
    return (
        <div className={form.className}>
            {/** 隐藏组件 hidden **/}
            {Fm.aiHidden(reference, initials, raft)}
            {/** 字段渲染 **/}
            {aiField(reference, initials, raft)}
        </div>
    )
};

const aiForm = (reference, values, configuration = {}) => {
    /*
     * 初始值 initial 优先
     */
    let initials = __Zn.xtInited(reference, values);
    __Zn.dgDebug(initials, "表单初始化", "#EE3A8C")
    /*
     * 日志记录
     */
    const {config = {}, form} = reference.props;
    // form 专用属性
    const {raft = {}} = reference.state;
    let attrs = __Zn.clone(raft.form);
    if (!attrs) attrs = {};
    if (configuration['formKey']) {
        attrs.key = configuration['formKey'];
    }
    // form 中的 className
    if (configuration.className) {
        attrs.className = `ux_form ${configuration.className}`;
    } else {
        const configForm = config.form ? config.form : {};
        if (configForm.className) {
            if (0 < configForm.className.indexOf('ux_form')) {
                attrs.className = configForm.className;
            } else {
                attrs.className = `ux_form ${configForm.className}`;
            }
        } else {
            attrs.className = `ux_form`;
        }
    }
    if (form) attrs.form = form;
    return (
        <Form {...attrs} ref={reference.formRef}>
            {/** 隐藏组件 hidden **/}
            {Fm.aiHidden(reference, initials, raft)}
            {/** 字段渲染 **/}
            {aiField(reference, initials, raft)}
        </Form>
    )
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    aiField,
    aiFormInput,
    aiForm,
}