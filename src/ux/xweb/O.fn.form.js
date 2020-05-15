import React from 'react';
import {Col, Form, Input, Radio, Row, Select} from 'antd';
import Abs from '../abyss';
import Ele from "../element";

const xtSelect = (rest = {}, options = []) => (
    <Select {...rest}>
        {options.map(each => (
            <Select.Option key={each.key} value={each.key}>
                {each.text}
            </Select.Option>
        ))}
    </Select>
)

const xtRadio = (rest = {}, options = []) => (
    <Radio.Group {...rest}>
        {options.map(each => (
            <Radio key={each.key} value={each.key}>
                {each.text}
            </Radio>
        ))}
    </Radio.Group>
)

const xtOptions = (config) => {
    /* options */
    if (config.options) {
        const {
            options = [], onChange,
            component,
            ...rest
        } = config;
        const $options = [];
        options.forEach(item => {
            const literal = item.split(',');
            const option = {};
            option.key = literal[0];
            option.text = literal[1];
            $options.push(option);
        });
        if (!config.component) {
            config.component = Select;
        }
        if (Abs.immutable([Select, Radio]).contains(config.component)) {
            config.render = (props) => {
                const {value} = props;
                rest.value = value;
                if (!rest.style) {
                    rest.style = {};
                }
                Object.assign(rest.style, {minWidth: "100%"});
                if (Abs.isFunction(onChange)) {
                    rest.onChange = onChange;
                }
                if (Select === config.component) {
                    return xtSelect(rest, $options);
                } else if (Radio === config.component) {
                    return xtRadio(rest, $options);
                } else return false;
            }
        } else {
            /* 其他种类 */
            config.options = $options;
        }
    }
    return config;
}
const xtRow = (item) => Abs.itAmb(item, input => {
    const config = {};
    if ("string" === typeof input) {
        /* 单行专用 */
        config.label = input;
    } else {
        /* 带配置的单行 */
        Object.assign(config, input);
    }
    /* options */
    xtOptions(config);
    /* component */
    if (!config.component) {
        config.component = Input;
    }
    return config;
})
const FORM_ITEM = {
    1: {
        labelCol: {
            span: 4
        },
        wrapperCol: {
            span: 20
        }
    },
    2: {
        labelCol: {
            span: 8
        },
        wrapperCol: {
            span: 16
        }
    }
}
const xtItem = (rows = [], reference) => {
    const normalized = [];
    const length = rows.length;
    rows.forEach(cell => {
        const {label, component, render, ...rest} = cell;
        const field = {};
        const item = {label};
        Object.assign(item, FORM_ITEM[length]);
        /* 计算item */
        if (!item.label) {
            item.labelCol = {span: 0}
            item.wrapperCol = {span: 24}
        }
        field.span = 24 / length;
        /* onChangeJ 专用函数 */
        if (!Abs.isFunction(rest['onChange'])) {
            /* 下层 onChange 函数 */
            rest.onChange = (event) => {
                const value = Ele.ambiguityEvent(event);
                const data = {};
                data[field] = value ? value : undefined;
                Abs.fn(reference).onChange(data);
            }
        }
        field.field = rest;
        field.item = item;
        field.component = component;
        if (render) field.render = render;
        normalized.push(field);
    });
    return normalized;
}
/*
 * 输入格式：
 * [
 *      [
 *
 *      ]
 * ]
 */
export default (fields = [], reference) => (
    <div className={"complex-form"}>
        {fields.map((item, rowIndex) => (
            <Row key={`row${rowIndex}`}>
                {(() => {
                    let rows = [];
                    if (Abs.isArray(item)) {
                        rows = rows.concat(xtRow(item));
                    } else {
                        rows = [xtRow(item)];
                    }
                    return xtItem(rows, reference).map((cell, colIndex) => {
                        const {span, item} = cell;
                        if (span) {
                            return (
                                <Col span={span} key={`col${rowIndex}${colIndex}`}>
                                    <Form.Item {...item}>
                                        {(() => {
                                            const {field, component, render} = cell;
                                            if (Abs.isFunction(render)) {
                                                return render({value: field.value});
                                            } else {
                                                const UI = component;
                                                return (
                                                    <UI {...field}/>
                                                )
                                            }
                                        })()}
                                    </Form.Item>
                                </Col>
                            )
                        } else return false;
                    })
                })()}
            </Row>
        ))}
    </div>
)