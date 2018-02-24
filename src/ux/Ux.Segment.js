import React from 'react'
import Opts from './Ux.Option';
import Norm from './Ux.Normalize'
import Jsx from './Ux.Jsx'
import { Form, Row, Col, Button } from 'antd'

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
 * **/
const _uiDisplay = (row = {}) => {
    const style = row.style ? row.style : {};
    if (1 === row.length) {
        const item = row[0];
        if (item.hidden) {
            if (item.field === "$button") {
                style.display = "none";
            }
        }
    }
    return style;
};
const _uiRow = (row) => {
    if (Array.prototype.isPrototypeOf(row)) {
        return row;
    } else {
        return row.items;
    }
};
const uiFieldForm = (reference = {}, renders = {}, column = 4, values = {}) => {
    const form = Norm.extractForm(reference);
    const ops = Norm.extractOp(reference);
    const hidden = Norm.extractHidden(reference);
    const span = 24 / column;
    const btnOpts = Opts.optionFormItem();
    btnOpts.label = ' ';
    btnOpts.colon = false;
    return (
        <Form layout="inline" className="page-form">
            { form.map((row, index) => (
                <Row key={ `form-row-${index}` } style={ _uiDisplay(row) }>
                    { _uiRow(row).map(item => {
                        // 初始化
                        if (values.hasOwnProperty(item.field)) {
                            if (!item.optionConfig) {
                                item.optionConfig = {};
                            }
                            item.optionConfig.initialValue = values[item.field];
                        }
                        // 渲染
                        return (
                            (item.hasOwnProperty("title")) ? (
                                <Col className="page-title" key={ item.field }>
                                    { /** 只渲染Title **/ }
                                    { item.title }
                                </Col>
                            ) : (
                                <Col span={ item.span ? item.span : span } key={ item.field }>
                                    { /** 渲染字段 **/ }
                                    { Jsx.jsxField(reference, item,
                                        renders[item.field] ? renders[item.field] : () => false) }
                                </Col>
                            )
                        )
                    }) }
                </Row>
            )) }
            { ops ? (
                <Row style={ {display : hidden.opVisible ? 'inline' : 'none'} }>
                    <Col span={ span }>
                        <Form.Item { ...btnOpts }>
                            { ops.map(op => <Button { ...op }>{ op.text }</Button>) }
                        </Form.Item>
                    </Col>
                </Row>
            ) : false }
        </Form>
    )
}
export default {
    // Form专用Render，可共享
    uiFieldForm
}
