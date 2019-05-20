import React from 'react';
import {Col, Row, Table} from 'antd';
import Fn from '../Fx';

const renderPageList = (reference, item = {}) => {
    const $table = Fn.configTable(reference);
    return (
        <Row>
            <Row>

            </Row>
            <Row>
                <Col span={24}>
                    <Table {...$table}/>
                </Col>
            </Row>
        </Row>
    );
};
export default {
    "list": renderPageList
}