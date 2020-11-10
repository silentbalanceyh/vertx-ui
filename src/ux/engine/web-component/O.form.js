import Abs from '../../abyss';
import Ele from '../../element';
import Dev from '../../develop';
import Cfg from '../config';
import Ut from '../../unity';
import React from 'react';
import U from 'underscore';
import {Col, Form, Row} from 'antd';
import {LoadingAlert} from 'web';
import WebField from '../web-field';

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
    } else if (config.tips) {
        const offset = Ele.valueInt(config.offset, 0);
        const span = 24 - offset;
        const attrs = {offset, span};
        if (config.style) {
            attrs.style = config.style;
        }
        return (
            <Col {...attrs} key={cellRest['key']} className={"ux-tips"}>
                {title}
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
        /*
         * 如果有 rules 则带上 hasFeedback
         * 有 rules 表示有验证规则，则需要设置验证过后的效果
         */
        if (optionConfig.rules && 0 < optionConfig.rules.length) {
            attached.hasFeedback = true;
        }
        /*
         * 检测 __render 值，特殊的验证效果处理
         * 设置特殊的验证效果，主要是非输入型组件的验证效果专用处理
         * 追加 web-form-has-error 类名，保证验证时的提示处理
         * */
        const colAttrs = Ut.connectItem(cell);
        return (
            <Col {...colAttrs}>
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
    const {$inited = {}, $record = {}, rxInited = record => record} = reference.props;
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
    /*
     * 外置注入修改初始值专用
     */
    if (Abs.isFunction(rxInited)) {
        detect = rxInited(detect);
    }
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

    const touched = form.isFieldsTouched();
    if (!touched) {
        const options = raft.options ? raft.options : {};
        Dev.dgDebug(initials, "初始化表单数据：" + options.id, "#8B5A00");
    }
    return (
        <Form {...attrs}>
            {/** 隐藏组件 hidden **/}
            {aiHidden(reference, initials, raft)}
            {/** 字段渲染 **/}
            {aiField(reference, initials, raft)}
        </Form>
    )
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
const aiFormField = (reference, fieldConfig = {}, fnJsx) => {
    const {form} = reference.props;
    if (fieldConfig) {
        let fnRender;
        if (Abs.isFunction(fnJsx)) {
            fnRender = fnJsx;
        } else {
            if (fieldConfig.render) {
                fnRender = WebField[fieldConfig.render];
            } else {
                fnRender = WebField.aiInput;
            }
        }
        const {
            optionItem,
            optionConfig,
            optionJsx,
            field,
        } = fieldConfig;
        const {getFieldDecorator} = form;
        return (
            <Form.Item {...optionItem}>
                {getFieldDecorator(field, optionConfig)(fnRender(reference, optionJsx))}
            </Form.Item>
        )
    } else {
        return false;
    }
}
export default {
    aiForm,
    aiInit, // 统一处理
    aiField,
    aiFormInput,
    aiFormField,
}