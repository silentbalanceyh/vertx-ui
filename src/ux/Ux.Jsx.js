import React from 'react';
import Opt from './Ux.Option'
import Norm from './Ux.Normalize'
import Prop from './Ux.Prop'
import {Button, Col, Form, Row} from 'antd'
import Dg from './Ux.Debug'
import Immutable from 'immutable';

/**
 * 验证规则属性
 * message：校验文件
 * type: 可选（内建类型）
 * required：是否必填
 * len:字段长度
 * min:最小长度
 * max:最大长度
 * enum: 枚举类型
 * pattern:正则表达式校验
 * transform:校验前转换字段值
 * validator: 自定义校验
 * @method _uiDisplay
 * @private
 * @param row 显示行数据
 * @param addition 额外风格
 * **/
const _uiDisplay = (row = {}, addition = {}) => {
    const style = row.style ? row.style : {};
    if (1 === row.length) {
        // 单按钮
        const item = row[0];
        if (item.hidden) {
            if (item.field === "$button") {
                style.display = "none";
            }
        }
        // 标题单行修正间距专用
        if (item.title) {
            style.height = `42px`;
        }
    }
    return Object.assign(addition, style);
};
const _uiRow = (row) => {
    if (Array.prototype.isPrototypeOf(row)) {
        return row;
    } else {
        return row.items ? row.items : [];
    }
};
/**
 * Jsx单字段的Render处理
 * @method jsxField
 * @param {React.PureComponent} reference React对应组件引用
 * @param item Form中的Item配置信息
 * @param render 专用render函数
 * @return {*}
 */
const jsxField = (reference, item = {}, render) => {
    Dg.ensureRender(render, item);
    item = Immutable.fromJS(item).toJS();
    const {form} = reference.props;
    const {getFieldDecorator} = form;
    return item.optionItem ? (
        <Form.Item {...Opt.optionFormItem(item.optionItem)}>
            {0 <= item.field.indexOf("$") ?
                render(reference, item.optionJsx) :
                getFieldDecorator(item.field, item.optionConfig)(
                    render(reference, item.optionJsx)
                )}
        </Form.Item>
    ) : render(reference, item.optionJsx, item.optionConfig)
};
/**
 * Jsx单行字段的Render处理
 * @method jsxFieldRow
 * @param {React.PureComponent} reference React对应组件引用
 * @param item
 * @param render
 * @return {*}
 */
const jsxFieldRow = (reference, item = {}, render) => {
    Dg.ensureRender(render, item);
    item = Immutable.fromJS(item).toJS();
    const {form} = reference.props;
    const {getFieldDecorator} = form;
    return (
        <Form.Item {...item.optionItem}>
            {getFieldDecorator(item.field, item.optionConfig)(
                render(reference, item.optionJsx))}
        </Form.Item>
    )
};

const _jsxFieldTitle = (item = {}) => (
    <Col className="page-title" key={item.field}>
        {/** 只渲染Title **/}
        {item.title}
    </Col>
);
const _jsxFieldCommon = (reference, renders, item = {}, span = 6) => {
    const fnRender = renders[item.field];
    if (fnRender) {
        // 渲染
        return (
            <Col span={item.span ? item.span : span} key={item.field}>
                {/** 渲染字段 **/}
                {jsxField(reference, item,
                    renders[item.field] ? renders[item.field] : () => false)}
            </Col>
        )
    } else {
        return false;
    }
};
const _jsxField = (reference = {}, renders = {}, column = 4, values = {}, form = {}) => {
    const span = 24 / column;
    // 行配置处理
    const formConfig = Prop.fromHoc(reference, "form");
    const rowConfig = formConfig['rowConfig'] ? formConfig['rowConfig'] : {};
    // 读取配置数据
    return form.map((row, index) => (
        <Row key={`form-row-${index}`} style={_uiDisplay(row, rowConfig[index])}>
            {_uiRow(row).map(item => {
                // 初始化
                if (values.hasOwnProperty(item.field)) {
                    if (!item.optionConfig) {
                        item.optionConfig = {};
                    }
                    item.optionConfig.initialValue = values[item.field];
                }
                if (item.hasOwnProperty("title")) {
                    // 单Title
                    return _jsxFieldTitle(item);
                } else {
                    return _jsxFieldCommon(reference, renders, item, span);
                }
            })}
        </Row>
    ));
};
/**
 * 仅渲染交互式组件，Grid布局
 * @method jsxFieldGrid
 * @param {React.PureComponent} reference React对应组件引用
 * @param renders 每个字段不同的render方法
 * @param column 当前Form的列数量
 * @param values Form的初始化值
 * @return {boolean}
 */
const jsxFieldGrid = (reference = {}, renders = {}, column = 4, values = {}) => {
    // Fix Issue
    if (!values) values = {};
    const form = Norm.extractForm(reference);
    return _jsxField(reference, renders, column, values, form);
};
/**
 * 分组渲染交互式控件
 * @method jsxFieldGroup
 * @param {React.PureComponent} reference React对应组件引用
 * @param renders 每个字段不同的render方法
 * @param column 当前Form的列数量
 * @param values Form的初始化值
 * @param groupIndex 当前需要渲染的group的组
 * @return {boolean}
 */
const jsxFieldGroup = (reference = {}, renders = {}, column = 4, values = {}, groupIndex) => {
    // Fix Issue
    if (!values) values = {};
    const form = Norm.extractGroupForm(reference, groupIndex);
    return _jsxField(reference, renders, column, values, form);
};
/**
 * 仅渲染按钮
 * @method jsxOp
 * @param reference
 * @param column
 * @param op
 * @return {boolean}
 */
const jsxOp = (reference = {}, column = 4, op = {}) => {
    const ops = Norm.extractOp(reference, op);
    const hidden = Norm.extractHidden(reference);
    const span = 24 / column;
    const btnOpts = Opt.optionFormItem();
    btnOpts.label = ' ';
    btnOpts.colon = false;
    const opStyle = {};
    if (hidden.op) {
        opStyle.display = "none"
    }
    return (ops && 0 < ops.length ? (
        <Row style={opStyle}>
            <Col span={span}>
                <Form.Item {...btnOpts}>
                    {ops.map(op => <Button {...op}>{op.text}</Button>)}
                </Form.Item>
            </Col>
        </Row>
    ) : false)
};
/**
 * 针对Form进行分行渲染专用方法，可按照Grid的布局进行渲染
 * @method uiFieldForm
 * @param {React.PureComponent} reference React对应组件引用
 * @param renders 每个字段不同的render方法
 * @param column 当前Form的列数量
 * @param values Form的初始化值
 * @param op 追加方法
 * @return {*}
 */
const uiFieldForm = (reference = {}, renders = {}, column = 4, values = {}, op = {}) => {
    // Fix Issue
    if (!values) values = {};
    return (
        <Form layout="inline" className="page-form">
            {jsxFieldGrid(reference, renders, column, values)}
            {jsxOp(reference, column, op)}
        </Form>
    )
};

/**
 * 渲染某个子表单的Page页
 * @method jsxFieldPage
 * @param {React.PureComponent} reference React对应组件引用
 * @param renders 每个字段不同的render方法
 * @param jsx 当前Form的列数量
 * @param entity Form的初始化值
 * @param key 读取配置的专用
 * @return {boolean}
 */
const jsxFieldPage = (reference, renders, jsx, entity = {}, key) => {
    // 行配置处理
    const formCfg = Norm.extractForm(reference, key);
    return formCfg.map((row, index) => (
        <Row key={`form-range-row-${index}`} style={{height: 39}}>
            {row.map(item => {
                // 初始化
                const $item = Immutable.fromJS(item).toJS();
                $item.field = `children.${entity.key}.${item.field}`;
                return (
                    <Col span={item.span ? item.span : 8} key={$item.field}>
                        {jsxField(reference, $item, renders[item.field])}
                    </Col>
                )
            })}
        </Row>
    ));
};
/**
 * @class Jsx
 * @description 字段专用输出函数
 */
export default {
    // Form专用
    uiFieldForm,
    // -------------- 以上为Form内置 ---------------
    /**
     * 登录页这种单列布局使用
     * 配置文件格式【一维数组】
     * "_form":{
     *     "ui":[
     *         {
     *         }
     *     ]
     * }
     */
    jsxFieldRow,
    /**
     * Grid布局使用
     * 配置文件格式【二维数组】
     * "_form":{
     *     "ui":[
     *         [
     *              {
     *              }
     *         ]
     *     ]
     * }
     */
    jsxFieldGrid,
    /**
     * Tab -> Grid布局使用
     * 配置文件格式【三维数组】
     * "_form":{
     *     "ui":[
     *         [
     *              [
     *                  {
     *                  }
     *              ]
     *         ]
     *     ]
     * }
     */
    jsxFieldGroup,
    // 渲染子表单专用，可根据Form的key渲染子表单，field且不一样
    jsxFieldPage,
    // 单个字段的渲染
    jsxField,
    // 单个按钮的渲染
    jsxOp
}
