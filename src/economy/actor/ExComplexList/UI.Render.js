import React from 'react';
import {Col, Row} from 'antd';

import IxOpOpen from '../IxOpOpen/UI';
import IxOpBatch from '../IxOpBatch/UI';

import IxTable from '../IxTable/UI';

import Ux from "ux";
import Fx from '../Fx';

const renderAdd = (reference) => {
    const {options = {}} = reference.state;
    return (<IxOpOpen reference={reference} $options={options}/>);
};
const renderTable = (reference) => {
    const {options = {}, table = {}, data = {}} = reference.state;
    return (<IxTable reference={reference} $options={options}
                     $table={table} $data={data}/>);
};

const renderBatch = (reference) => {
    const {options = {}, $keys = []} = reference.state;
    if (Fx.testBatch(options)) {
        return (<IxOpBatch reference={reference}
                           $options={options}
                           $keys={$keys}/>);
    } else return false;
};

const renderPageList = (reference, item = {}) => {
    return (
        <Row>
            <Row className={Ux.ECONOMY.ROW_HEAD}>
                <Col span={2}>
                    {renderAdd(reference)}
                </Col>
                <Col span={8}>
                    {renderBatch(reference)}
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