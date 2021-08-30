import React from 'react';
import {Alert, Button, Col, Radio, Row, Select, Tag} from "antd";
import Op from './Op';
import Ux from 'ux';
import Rdr from './Web.R'

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

export default {
    renderNotice: (reference, qrMessage = {}) => {
        const {message = []} = qrMessage;
        return (
            <div className={"notice"}>
                {message.map(each => {
                    if (each.field) {
                        return (
                            <Alert key={each.field} message={each.text} closable
                                   onClose={Op.rxDelete(reference, each)}/>
                        )
                    } else {
                        return (
                            <Alert key={"CONNECTOR"} type={"warning"}
                                   message={each.text}/>
                        )
                    }
                })}
            </div>
        );
    },
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
        return (
            <div className={"form"}>
                <Row>
                    <Col span={left} className={"right"}>
                        {formLabel.connector}
                    </Col>
                    <Col span={right}>
                        <Radio.Group value={value.connector}
                                     onChange={Op.Field.rxConnector(reference)}>
                            <Radio value={"OR"}>OR</Radio>
                            <Radio value={"AND"}>AND</Radio>
                        </Radio.Group>
                    </Col>
                </Row>
                <Row>
                    <Col span={left} className={"right"}>
                        {formLabel.field}
                    </Col>
                    <Col span={right}>
                        <Select style={{width: "100%"}} allowClear
                                value={$waiting.field}
                                onChange={Op.Field.rxName(reference)}>
                            {options.map(option => (
                                <Select.Option key={option.key} value={option.value}>
                                    {option.label}（{option.key}）
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
                <Row>
                    <Col span={left} className={"right"}>
                        {formLabel.op}
                    </Col>
                    <Col span={right}>
                        {(() => {
                            const {op = []} = formInput;
                            const $op = Op.yoOp(op, configuration, reference);
                            return (
                                <Select style={{width: "70%"}}
                                        value={$waiting.op}
                                        onChange={Op.Field.rxOp(reference)}>
                                    {$op.map(o => (
                                        <Select.Option key={o.key} value={o.value}>
                                            {o.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                            );
                        })()}
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
                        <Button icon={"double-left"} type={"primary"}
                                onClick={Op.rxQr(reference, configuration)}>
                            {formLabel.button}
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }
}