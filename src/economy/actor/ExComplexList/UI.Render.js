import React from 'react';
import {Col, Row, Table} from 'antd';
import Fn from '../Fx';

import IxOpenTab from '../IxOpenTab/UI';
import Ux from "ux";

const renderAdd = (reference) => {
    const {options = {}} = reference.state;
    return (<IxOpenTab reference={reference} $options={options}/>);
};

const renderPageList = (reference, item = {}) => {
    const $table = Fn.configTable(reference);
    return (
        <Row>
            <Row className={Ux.ECONOMY.ROW_HEAD}>
                <Col span={2}>
                    {renderAdd(reference)}
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table {...$table} className={Ux.ECONOMY.TABLE_CONTROL}/>
                </Col>
            </Row>
        </Row>
    );
};
const renderPageAdd = (reference, item = {}, key) => {

    return false;
};
export default {
    "list": renderPageList,
    "add": renderPageAdd,
};