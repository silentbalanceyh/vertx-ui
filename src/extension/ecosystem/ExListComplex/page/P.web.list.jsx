import {Col, Row} from "antd";
import React from "react";
import './Cab.less';
import Ux from "ux";

import ExAction from '../../ExAction/UI';
import ExTable from '../../ExTable/UI';
import ExSearch from '../../ExSearch/UI';

export default (reference, {
    css: {
        clsRow = Ux.Env.ECONOMY.ROW_HEAD
    },
    opens = {},  // Open区域
    batch = {},  // Batch区域
    search = {}, // Search区域
    extra = {},  // Extra区域
    table = {},  // Table专用
}) => {
    const exchange = {};
    if (0 === extra.config.length) {
        exchange.batch = {span: 12, xl: 12, xxl: 14}
        exchange.search = {span: 8, xl: 8, xxl: 7, className: "ex-extra"};
        exchange.extra = {span: 0, xl: 0, xxl: 0};
    } else {
        exchange.batch = {span: 9, xl: 9, xxl: 12}
        exchange.search = {span: 8, xl: 8, xxl: 7};
        exchange.extra = {span: 3, xl: 3, xxl: 2, className: "ex-extra"};
    }
    return (
        <Row>
            <Row className={clsRow}>
                <Col span={4} xl={4} xxl={3}>
                    {0 < opens.config.length ? (<ExAction {...opens}/>) : false}
                </Col>
                <Col {...exchange.batch}>
                    {0 < batch.config.length ? (<ExAction {...batch}/>) : false}
                </Col>
                <Col {...exchange.search}>
                    {!Ux.isEmpty(search) ? (<ExSearch {...search}/>) : false}
                </Col>
                <Col {...exchange.extra}>
                    {0 < extra.config.length ? (<ExAction {...extra}/>) : false}
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <ExTable {...table}/>
                </Col>
            </Row>
        </Row>
    )
}