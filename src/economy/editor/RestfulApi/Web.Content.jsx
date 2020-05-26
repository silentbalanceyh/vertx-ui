import React from 'react';
import {Col, Input, Row, Table} from 'antd';

export default (reference) => {
    const {$op = {}, $table = {}} = reference.state;
    const {search = {}} = $op;
    return (
        <div>
            <Row>
                <Col span={12}>
                    <Input.Search {...search}/>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table {...$table}/>
                </Col>
            </Row>
        </div>
    )
}