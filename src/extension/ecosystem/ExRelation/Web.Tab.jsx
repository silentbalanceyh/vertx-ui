import React from 'react';
import {Col, Row, Table, Tabs, Tag} from 'antd';
import Ux from 'ux';
import Op from './Op';
import renderTool from './Web.Tab.Op';
import renderBatch from './Web.Tab.Batch';

const renderTag = (reference, tips = {}) => {
    const {config = {}} = reference.props;
    const colAttrs = {};
    if (config.editable) {
        colAttrs.style = {paddingTop: 4};
    }
    colAttrs.className = "row-right";
    colAttrs.span = 4;
    return (
        <Col {...colAttrs}>
            {/** 标签用于表示关系相关处理 **/}
            <Tag color={tips.color} style={{fontSize: 15}}>
                {tips.title}
            </Tag>
        </Col>
    )
};
const renderPage = (reference, data, key, combine) => {
    let relation = Ux.fromHoc(reference, "relation");
    if (!relation) relation = {};
    if (relation[key]) {
        const {table = {}, tips = {}} = relation[key];
        const $table = Op.yoTable(reference, table, key, combine);
        return (
            <div className={"ex-relation-body"}>
                <Row className={"row"}>
                    {renderTool(reference, data, key)}
                    {renderBatch(reference, data, key)}
                    {renderTag(reference, tips)}
                </Row>
                <Row>
                    <Col span={24}>
                        <Table {...$table} dataSource={data}/>
                    </Col>
                </Row>
            </div>
        )
    } else return false;
};

export default (reference, tabs = {}) => {
    const {items = [], ...rest} = tabs;
    /*
     * Tab页签添加滚动条
     */
    let height = document.body.clientHeight;
    height = height - 300;
    return 0 < items.length ? (
        <Tabs {...rest} style={{height}}>
            {items.map(item => {
                const {up = [], down = [], combine, ...rest} = item;
                return (
                    <Tabs.TabPane {...rest}>
                        {renderPage(reference, up, "up", combine)}
                        {renderPage(reference, down, "down", combine)}
                    </Tabs.TabPane>
                )
            })}
        </Tabs>
    ) : Ux.aiEmpty()
}