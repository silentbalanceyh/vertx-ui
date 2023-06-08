import React from 'react';
import {Button, Col, Radio, Row, Select, Tag} from "antd";
import Op from './Form.Op';
import Ux from 'ux';
import Rdr from './Form.Field'

const renderInput = (reference, configuration = {}) => {
    const {$waiting = {}} = reference.state;
    const {
        info = {},
        options = []
    } = configuration.config ? configuration.config : {};
    if ($waiting.field) {
        const found = Ux.elementUnique(options, 'key', $waiting.field);
        if (found) {
            const fnRender = Rdr[found.control ? found.control : "TEXT"];
            if (Ux.isFunction(fnRender)) {
                const $op = Ux.immutable(["n", "!n"]);
                if ($op.contains($waiting.op)) {
                    return (
                        <Tag color={"green"} style={{
                            fontSize: 13
                        }}>
                            {info['noneed']}
                        </Tag>
                    );
                } else {
                    return fnRender(reference, configuration);
                }
            } else {
                console.warn("无法解析类型：" + found.control);
                return false;
            }
        } else {
            const errorMsg = Ux.formatExpr(info.error, {name: $waiting.field});
            return (
                <Tag color={"red"} style={{
                    fontSize: 13
                }}>
                    {errorMsg}
                </Tag>
            )
        }
    } else {
        return (
            <Tag color={"red"} style={{
                fontSize: 13
            }}>
                {info['empty']}
            </Tag>
        )
    }
}

const renderConnector = (reference, value) => {
    const options = [{
        label: "OR", value: "OR"
    }, {
        label: "AND", value: "AND"
    }];
    const attrs = {};
    attrs.value = value;
    attrs.onChange = Op.Field.rxConnector(reference);
    attrs.options = options;
    return (<Radio.Group {...attrs}/>)
}
const renderOp = (reference, configuration, formInput) => {
    const {$waiting = {}} = reference.state;
    const {op = []} = formInput;
    const $op = Op.yoOp(op, configuration, reference);
    const attrs = {};
    attrs.style = {width: "80%"};
    attrs.value = $waiting.__op ? $waiting.__op : $waiting.op;
    attrs.onChange = Op.Field.rxOp(reference);
    attrs.options = $op;
    return (<Select {...attrs}/>);
}
const renderAttr = (reference, options = []) => {
    const {$waiting = {}} = reference.state;
    const attrs = {};
    attrs.style = {width: "100%"};
    attrs.allowClear = true;
    attrs.value = $waiting.field;
    attrs.onChange = Op.Field.rxName(reference);
    const $options = [];
    options.filter(option => Object.keys(Rdr).includes(option.control)).forEach(option => {
        const optionItem = {};
        optionItem.key = option.key;
        optionItem.value = option.value;
        optionItem.label = `${option.label}（${option.value}）`;
        $options.push(optionItem);
    });
    attrs.options = $options;
    return (<Select {...attrs}/>);
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    renderForm: (reference, config = {}, value = {}) => {
        const {
            formLabel = {},
            formInput = {},
            options = []
        } = config;
        const left = 8;
        const right = 15;
        const {$waiting = {}} = reference.state;
        const item = Ux.elementUnique(options, 'key', $waiting.field);
        const configuration = {
            item, config,
        }
        const {info = {}} = config;
        return (
            <div className={"form"}>
                <Row>
                    <Col span={24} className={"ux_title"}>
                        {info.title}
                    </Col>
                </Row>
                <Row>
                    <Col span={left} className={"right"}>
                        {formLabel.connector}
                    </Col>
                    <Col span={right}>
                        {renderConnector(reference, value.connector)}
                    </Col>
                </Row>
                <Row>
                    <Col span={left} className={"right"}>
                        {formLabel.field}
                    </Col>
                    <Col span={right}>
                        {renderAttr(reference, options)}
                    </Col>
                </Row>
                <Row>
                    <Col span={left} className={"right"}>
                        {formLabel.op}
                    </Col>
                    <Col span={right}>
                        {renderOp(reference, configuration, formInput)}
                    </Col>
                </Row>
                <Row>
                    <Col span={left} className={"right"}>
                        {formLabel.value}
                    </Col>
                    <Col span={right}>
                        {renderInput(reference, configuration)}
                    </Col>
                </Row>
                <Row>
                    <Col span={right} offset={left}>
                        <Button icon={Ux.v4Icon("double-right")} type={"primary"}
                                onClick={Op.rxSubmitFn(reference, configuration)}>
                            {formLabel.button}
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }
}