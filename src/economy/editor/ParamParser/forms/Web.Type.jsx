import React from 'react';
import Ux from 'ux';
import {Col, Row, Tag} from 'antd';

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

                </Col>
            </Row>
        </div>
    )
}