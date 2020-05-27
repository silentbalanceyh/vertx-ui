import React from 'react';
import {Button, Col, Row, Table} from 'antd';
import UiForm from './forms/Web.Form';
import './Cab.less';
import Op from './op';

export default (reference) => {
    const {$table = {}, data = []} = reference.state;
    return (
        <div>
            <Row className={"web-param-table"}>
                <Col span={24}>
                    <Table {...$table} dataSource={data}/>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <UiForm reference={reference} onChange={Op.onChange(reference)}/>
                </Col>
            </Row>
            <Button className={"ux-hidden"} id={"$opSave"} onClick={Op.onSubmit(reference)}/>
        </div>
    );
}