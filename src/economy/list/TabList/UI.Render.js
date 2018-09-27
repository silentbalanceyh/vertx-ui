import React from 'react'
import {Col, Row, Table, Tabs} from "antd";
import Op from "./Op";
import "./Cab.less";
import Ux from 'ux';

const renderPageAdd = (reference, item = {}) => {
    const {$formAdd: Component} = reference.props;
    // 添加的时候activeKey就应该只有一个，就是item.key
    return Component ? (
        <Tabs.TabPane {...item}>
            <Component
                fnClose={Op.rxClose(reference, item.key)}
                fnMock={Op.mockfnRecord(reference)}
                fnView={Op.rxView(reference, item.key)}
                $addKey={item.key}
                {...reference.props}/>
        </Tabs.TabPane>
    ) : false
};
const renderPageEdit = (reference, item = {}) => {
    const {$formEdit: Component} = reference.props;
    const {record} = reference.state;
    /**
     * 解决多个Tab页状态不同步的问题
     * 1.只有Active的面板可以操作
     * 2.根据activeKey来执行界面切换，同时刷新子界面对应的$inited
     * 3.在关闭窗口的时候传入activeKey，需要关闭的是当前的窗口
     */
    const $inited = record[item.key] ? record[item.key] : {};
    return Component ? (
        <Tabs.TabPane {...item}>
            {/**
             * 非常影响性能的一行代码，主要用于检查当前界面是否渲染，
             * 由于编辑界面有多个，只会出现一个激活界面，所以只有在
             * 渲染界面的key和activeKey相等的时候才执行该渲染
             * 这样不论打开多少个窗口，都不会引起问题
             **/}
            <Component
                fnClose={Op.rxClose(reference, item.key)}
                fnMock={Op.mockfnRecord(reference, true)}
                $inited={$inited} {...reference.props}/>
        </Tabs.TabPane>
    ) : false
};
const renderPageList = (reference, item = {}) => {
    const tableDatum = Op.initTable(reference);
    // 是否包含添加列
    const {rowKey} = reference.state;
    let dataSource = Ux.clone(tableDatum.data);
    if (rowKey) {
        dataSource = [{key: rowKey}].concat(dataSource);
    }
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
                <Col span={24}>
                    <Table {...tableDatum.table}
                           loading={!ready}
                           dataSource={dataSource}/>
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