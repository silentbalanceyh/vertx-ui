import React from 'react';
import {Col, Row, Tag} from "antd";
import DatumUnique from '../DatumUnique/UI';
import __Zn from '../zero.uca.dependency';

const onInput = (type, reference) => (value) => {
    let expr = type + ":";
    expr += __Zn.ambEvent(value);
    __Zn.fn(reference).onChange(expr);
}
const _EXECUTOR = {
    FIX: (reference, jsx) => __Zn.aiInput(reference, jsx, onInput("FIX", reference)),
    STATE: (reference, jsx) => __Zn.aiInput(reference, jsx, onInput("STATE", reference)),
    PROP: (reference, jsx) => __Zn.aiInput(reference, jsx, onInput("PROP", reference)),
    ROUTE: (reference, jsx) => __Zn.aiInput(reference, jsx, onInput("ROUTE", reference)),
    USER: (reference, jsx) => __Zn.aiInput(reference, jsx, onInput("USER", reference)),
    FORM: (reference, jsx) => __Zn.aiInput(reference, jsx, onInput("FORM", reference)),
    ENUM: (reference, jsx) => __Zn.aiInputMulti(reference, jsx, values => {
        let expr = "ENUM:";
        if (__Zn.isArray(values)) {
            expr += values.join('`');
        }
        __Zn.fn(reference).onChange(expr);
    }),
    BOOL: (reference, jsx) => __Zn.aiRadio(reference, jsx, onInput("BOOL", reference)),
    UNIQUE: (reference, jsx) => (
        <DatumUnique {...jsx} reference={reference}
                     onChange={(expr) => __Zn.fn(reference).onChange(expr)}/>
    )
}

const renderByType = (reference, jsx = {}) => {
    const ref = __Zn.onReference(reference, 1);
    const type = __Zn.formHit(ref, "type");
    if (type) {
        const {$expression = {}} = reference.props;
        const config = $expression[type];
        const executor = _EXECUTOR[type];
        if (__Zn.isFunction(executor)) {
            return executor(reference, {
                ...jsx,
                ...config,
            })
        } else return false;
    } else return false;
}

class Component extends React.PureComponent {
    render() {
        const {value} = this.props;
        return (
            <div>
                <Row>
                    <Col span={24}>
                        {value ? (
                            <Tag color={"purple"}>
                                {value}
                            </Tag>
                        ) : (
                            <Tag>......</Tag>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        {renderByType(this)}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Component;