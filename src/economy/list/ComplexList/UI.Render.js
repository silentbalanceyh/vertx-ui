import React from 'react'
import {Col, Row, Table, Tabs} from "antd";
import Op from "./Op";

const renderPageAdd = (reference, item = {}) => {
    const {$formAdd: Component} = reference.props;
    return Component ? (
        <Tabs.TabPane {...item}>
            <Component fnClose={Op.rxClose(reference, item)} {...reference.props}/>
        </Tabs.TabPane>
    ) : false
};
const renderPageEdit = (reference, item = {}) => {
    const {$formUpdate: Component} = reference.props;
    const {record} = reference.state;
    const $inited = record[item.key] ? record[item.key] : {};
    return Component ? (
        <Tabs.TabPane {...item}>
            <Component fnClose={Op.rxClose(reference, item)} $inited={$inited} {...reference.props}/>
        </Tabs.TabPane>
    ) : false
};
const renderPageList = (reference, item = {}) => {
    const tableDatum = Op.initTable(reference);
    const ready = tableDatum.ready;
    return (
        <Tabs.TabPane {...item} closable={false}>
            <Row>
                <Col span={18}>
                    {Op.renderOp(reference)}
                </Col>
                <Col span={6}>
                    {Op.renderSearch(reference)}
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{
                    paddingTop: 10
                }}>
                    <Table {...tableDatum.table} loading={!ready} dataSource={tableDatum.data}/>
                </Col>
            </Row>
            {Op.renderDrawer(reference)}
        </Tabs.TabPane>
    )
};
export default {
    "add": renderPageAdd,
    "edit": renderPageEdit,
    "list": renderPageList
}