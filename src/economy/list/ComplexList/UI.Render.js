import React from 'react'
import {Col, Row, Table, Tabs} from "antd";
import Op from "./Op";
import "./Cab.less";
import Ux from 'ux';

const renderPageAdd = (reference, item = {}) => {
    const {$formAdd: Component} = reference.props;
    // 添加的时候activeKey就应该只有一个，就是item.key
    Ux.D.connectForm(reference, {
        item, activeKey: item.key
    });
    return Component ? (
        <Tabs.TabPane {...item}>
            <Component fnClose={Op.rxClose(reference, item.key)}
                       fnMock={Op.mockfnRecord(reference)}
                       {...reference.props}/>
        </Tabs.TabPane>
    ) : false
};
const renderPageEdit = (reference, item = {}, activeKey) => {
    const {$formEdit: Component} = reference.props;
    const {record} = reference.state;
    /**
     * 解决多个Tab页状态不同步的问题
     * 1.只有Active的面板可以操作
     * 2.根据activeKey来执行界面切换，同时刷新子界面对应的$inited
     * 3.在关闭窗口的时候传入activeKey，需要关闭的是当前的窗口
     */
    const $inited = record[activeKey] ? record[activeKey] : {};
    Ux.D.connectForm(reference, {
        item, init: $inited, activeKey
    });
    return Component ? (
        <Tabs.TabPane {...item}>
            <Component fnClose={Op.rxClose(reference, activeKey)}
                       fnMock={Op.mockfnRecord(reference, true)}
                       $inited={$inited} {...reference.props}/>
        </Tabs.TabPane>
    ) : false
};
const renderPageList = (reference, item = {}) => {
    const tableDatum = Op.initTable(reference);
    const ready = tableDatum.ready;
    return (
        <Tabs.TabPane {...item} closable={false}>
            <Row>
                <Col span={2}>
                    {Op.renderOp(reference)}
                </Col>
                <Col span={14}>
                    {Op.renderMessage(reference)}
                </Col>
                <Col span={7} offset={1}>
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