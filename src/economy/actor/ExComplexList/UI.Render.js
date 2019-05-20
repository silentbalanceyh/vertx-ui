import React from 'react';
import {Col, Row} from 'antd';

import IxOpenTab from '../IxOpenTab/UI';
import IxTable from '../IxTable/UI';

import Ux from "ux";

const renderAdd = (reference) => {
    const {options = {}} = reference.state;
    return (<IxOpenTab reference={reference} $options={options}/>);
};
const renderTable = (reference) => {
    const {options = {}, table = {}, data = {}} = reference.state;
    return (<IxTable reference={reference} $options={options}
                     $table={table} $data={data}/>);
};

const renderPageList = (reference, item = {}) => {
    return (
        <Row>
            <Row className={Ux.ECONOMY.ROW_HEAD}>
                <Col span={2}>
                    {renderAdd(reference)}
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    {renderTable(reference)}
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