import React from 'react';
import {Col, Row, Table} from 'antd';
import UiForm from './forms/Web.Form';

export default (reference) => {
    const {$table = {}, $data = []} = reference.state;
    return (
        <div>
            <Row>
                <Col span={24}>
                    <Table {...$table} dataSource={$data}/>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <UiForm reference={reference}/>
                </Col>
            </Row>
        </div>
    );
}