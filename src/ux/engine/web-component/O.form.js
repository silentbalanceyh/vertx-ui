import Abs from '../../abyss';
import Dev from '../../develop';
import Cfg from '../config';
import Ut from '../../unity';
import React from 'react';
import U from 'underscore';
import {Col, Form, Row} from 'antd';
import {LoadingAlert} from 'web';

const aiHidden = (reference, values = {}, raft = {}) => {
    if (raft.hidden) {
        return raft.hidden
            .filter(item => U.isFunction(item.render))
            .map(each => each.render(values))
    } else return false;
};

const _aiTitle = (reference, cell = {}) => {
    // Fix issue: render is invalid for prop
    const attrs = Abs.clone(cell);
    if (attrs.render) {
        delete attrs.render;
    }
    const {title, ...cellRest} = attrs;
    // Fix issue: list should has `key`
    if (!cellRest.key) cellRest.key = Ut.randomUUID();
    // 第二种格式出台
    const {config = {}} = cell;
    if (config.description) {
        return (
            <Col {...cellRest} span={24} className={"ux-comment"}>
                <LoadingAlert $alert={config}/>
            </Col>
        )
    } else {
        cellRest.className = `ux-title ux-title-pure`
        return (
            <Col {...cellRest} span={24}>
                {title}
            </Col>
        )
    }
}
const _aiInput = (reference, values) => (cell = {}) => {
    if (cell.title) {
        return _aiTitle(reference, cell);
    } else {
        // 其他项
        const {col = {}, optionItem = {}, optionConfig = {}} = cell;
        const attached = {};
        if (optionConfig.rules && 0 < optionConfig.rules.length) {
            attached.hasFeedback = true;
        }
        return (
            <Col {...col}>
                <Form.Item {...optionItem} {...attached}>
                    {cell.render ? cell.render(values) : false}
                </Form.Item>
            </Col>
        )
    }
};
const aiField = (reference, values = {}, raft = {}) =>
    (U.isArray(raft.rows)) ? raft.rows.map((row) => {
        const {cells = [], ...rest} = row;
        return (
            <Row {...rest}>
                {/* 单元格 */}
                {cells.map(_aiInput(reference, values))}
            </Row>
        )
    }) : false;
const aiInit = (reference, values) => {
    /*
     * 基础初始化
     */
    const {$inited = {}, $record = {}} = reference.props;
    let initials = {};
    if (values && !Abs.isEmpty(values)) {
        initials = Abs.clone(values);
    } else {
        initials = Abs.clone($inited);
    }
    /*
     * 配置初始化
     */
    const {raft = {}} = reference.state;
    let detect = {};
    if (raft.initial) {
        /*
         * 基础解析
         */
        detect = Cfg.initial(reference, raft, $record);
    }
    /*
     * initials 的优先级高于 detect
     */
    Object.assign(detect, initials);
    return Abs.clone(detect);   // 拷贝最终的值
};
/*
 * config 数据结构：
 * {
 *     formKey: 表单的 key（防止修改过后的不按预期的变更）
 * }
 */
const aiForm = (reference, values, config = {}) => {
    /*
     * 初始值 initial 优先
     */
    let initials = aiInit(reference, values);
    /*
     * 日志记录
     */
    const {form} = reference.props;
    const touched = form.isFieldsTouched();
    if (!touched) {
        Dev.dgDebug(initials, "初始化表单数据：", "#faad14");
    }
    // form 专用属性
    const {raft = {}} = reference.state;
    let attrs = Abs.clone(raft.form);
    if (!attrs) attrs = {};
    if (config['formKey']) {
        attrs.key = config['formKey'];
    }
    // form 中的 className
    if (config.className) {
        attrs.className = config.className;
    }
    return (
        <Form {...attrs}>
            {/** 隐藏组件 hidden **/}
            {aiHidden(reference, initials, raft)}
            {/** 字段渲染 **/}
            {aiField(reference, initials, raft)}
        </Form>
    );
};
const aiFormInput = (reference, values, raft = {}) => {
    /*
     * 初始值 initial 优先
     */
    let initials = aiInit(reference, values);
    const {form = {}} = raft;
    return (
        <div className={form.className}>
            {/** 隐藏组件 hidden **/}
            {aiHidden(reference, initials, raft)}
            {/** 字段渲染 **/}
            {aiField(reference, initials, raft)}
        </div>
    )
};
export default {
    aiForm,
    aiInit, // 统一处理
    aiField,
    aiFormInput
}