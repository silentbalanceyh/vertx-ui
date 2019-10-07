import Abs from '../../abyss';
import Dev from '../../develop';
import Cfg from '../config';

import React from 'react';
import U from 'underscore';
import {Col, Form, Row} from 'antd';

const aiHidden = (reference, values = {}, raft = {}) => {
    if (raft.hidden) {
        return raft.hidden
            .filter(item => U.isFunction(item.render))
            .map(each => each.render(values))
    } else return false;
};
const _aiInput = (reference, values) => (cell = {}) => {
    if (cell.title) {
        // Fix issue: render is invalid for prop
        const attrs = Abs.clone(cell);
        if (attrs.render) {
            delete attrs.render;
        }
        const {title, ...cellRest} = attrs;
        return (
            <Col {...cellRest} span={24}>{title}</Col>
        )
    } else {
        // 其他项
        const {col = {}, optionItem = {}} = cell;
        return (
            <Col {...col}>
                <Form.Item {...optionItem}>
                    {cell.render ? cell.render(values) : false}
                </Form.Item>
            </Col>
        )
    }
};
const aiField = (reference, values = {}, raft = {}) =>
    raft.rows.map((row) => {
        const {cells = [], ...rest} = row;
        return (
            <Row {...rest}>
                {/* 单元格 */}
                {cells.map(_aiInput(reference, values))}
            </Row>
        )
    });
const aiInit = (reference, values = {}) => {
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
        Dev.dgDebug(initials, "初始化表单数据：", "black");
    }
    // form 专用属性
    const {raft = {}} = reference.state;
    const attrs = Abs.clone(raft.form);
    if (config['formKey']) {
        attrs.key = config['formKey'];
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
export default {
    aiForm,
    aiField,
}