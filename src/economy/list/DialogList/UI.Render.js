import React from 'react'
import Op from './Op';
import {Button, Col, Row} from 'antd';

const renderHeader = (reference) => {
    const options = Op.readOption(reference);
    return options.hasOwnProperty('op.add') ? (
        <Row className={"page-topbar"}>
            <Col span={8}>
                <Button type="primary" htmlType={"button"}
                        onClick={Op.rxAdd(reference, options['op.add.window'])}>
                    {options['op.add']}
                </Button>
            </Col>
        </Row>
    ) : false;
};

export default {
    renderHeader
}