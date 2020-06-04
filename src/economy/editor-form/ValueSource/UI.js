import React from 'react';
import {Col, Row, Tag} from "antd";
import Ux from "ux";
import DatumUnique from '../DatumUnique/UI';
import {component} from "../../_internal";

const onInput = (type, reference) => (value) => {
    let expr = type + ":";
    expr += Ux.ambEvent(value);
    Ux.fn(reference).onChange(expr);
}
const _EXECUTOR = {
    FIX: (reference, jsx) => Ux.aiInput(reference, jsx, onInput("FIX", reference)),
    STATE: (reference, jsx) => Ux.aiInput(reference, jsx, onInput("STATE", reference)),
    PROP: (reference, jsx) => Ux.aiInput(reference, jsx, onInput("PROP", reference)),
    ROUTE: (reference, jsx) => Ux.aiInput(reference, jsx, onInput("ROUTE", reference)),
    USER: (reference, jsx) => Ux.aiInput(reference, jsx, onInput("USER", reference)),
    FORM: (reference, jsx) => Ux.aiInput(reference, jsx, onInput("FORM", reference)),
    ENUM: (reference, jsx) => Ux.aiInputMulti(reference, jsx, values => {
        let expr = "ENUM:";
        if (Ux.isArray(values)) {
            expr += values.join('`');
        }
        Ux.fn(reference).onChange(expr);
    }),
    BOOL: (reference, jsx) => Ux.aiRadio(reference, jsx, onInput("BOOL", reference)),
    UNIQUE: (reference, jsx) => (
        <DatumUnique {...jsx} reference={reference}
                     onChange={(expr) => Ux.fn(reference).onChange(expr)}/>
    )
}

const renderByType = (reference, jsx = {}) => {
    const ref = Ux.onReference(reference, 1);
    const {field = "type"} = jsx;
    const type = Ux.formHit(ref, field);
    if (type) {
        const $expression = Ux.fromHoc(reference, "expression");
        const config = $expression[type];
        const executor = _EXECUTOR[type];
        if (Ux.isFunction(executor)) {
            return executor(reference, {
                ...jsx,
                ...config,
            })
        } else return false;
    } else return false;
}

@component({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
})
class Component extends React.PureComponent {
    render() {
        const {value, field = "type"} = this.props;
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
                        {renderByType(this, {field})}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Component;