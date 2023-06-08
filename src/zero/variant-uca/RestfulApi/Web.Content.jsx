import React from 'react';
import {Col, Input, Row, Table} from 'antd';
import Op from './Op';

export default (reference) => {
    const {
        $op = {}, $table = {}, $data = [],
        $loading = false,
    } = reference.state;
    const {search = {}} = $op;
    return (
        <div className={"web-restful-content"}>
            <Row className={"restful-op"}>
                <Col span={12}>
                    <Input.Search {...search}/>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table {...$table}
                           loading={$loading}
                           dataSource={$data}
                           rowSelection={Op.onRowSelect(reference)}/>
                </Col>
            </Row>
        </div>
    )
}