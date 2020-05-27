import React from 'react';
import Ux from 'ux';
import {Col, Row, Tag} from 'antd';

const _EXECUTOR = {
    FIX: (reference, jsx) => Ux.aiInput(reference, jsx),
    STATE: (reference, jsx) => Ux.aiInput(reference, jsx),
    PROP: (reference, jsx) => Ux.aiInput(reference, jsx),
    ROUTE: (reference, jsx) => Ux.aiInput(reference, jsx),
    USER: (reference, jsx) => Ux.aiInput(reference, jsx),
    FORM: (reference, jsx) => Ux.aiInput(reference, jsx),
    ENUM: (reference, jsx) => Ux.aiInputMulti(reference, jsx),
    BOOL: (reference, jsx) => Ux.aiRadio(reference, jsx),
}

const renderByType = (reference, type) => {
    if (type) {
        const {$expression = {}} = reference.state;
        const config = $expression[type];
        const executor = _EXECUTOR[type];
        if (Ux.isFunction(executor)) {
            return executor(reference, config)
        } else return false;
    } else return false;
}

export default (reference, jsx) => {
    const expr = Ux.formHit(reference, 'expression');
    const type = Ux.formHit(reference, 'type');
    return (
        <div>
            <Row>
                <Col span={24}>
                    {expr ? (<Tag color={"green"}>
                        {expr}
                    </Tag>) : false}
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    {renderByType(reference, type)}
                </Col>
            </Row>
        </div>
    )
}