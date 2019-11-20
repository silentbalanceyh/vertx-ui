import React from 'react';
import {Col, Row, Table, Tabs} from 'antd';
import Ux from 'ux';

const renderPage = (reference, data) => {
    const table = Ux.fromHoc(reference, "table");
    const $table = Ux.clone(table);
    $table.columns = Ux.configColumn(reference, table.columns);
    $table.pagination = false;
    $table.className = "web-table ex-relation-table";
    const {config = {}} = reference.props;
    return (
        <div>
            {config.editable ? (
                <Row>
                    <Col span={24}>
                        操作按钮
                    </Col>
                </Row>
            ) : false}
            <Row>
                <Col span={24}>
                    <Table {...$table} dataSource={data}/>
                </Col>
            </Row>
        </div>
    )
};

export default (reference, tabs = {}) => {
    const {items = [], ...rest} = tabs;
    return 0 < items.length ? (
        <Tabs {...rest}>
            {items.map(item => {
                const {data = [], ...rest} = item;
                return (
                    <Tabs.TabPane {...rest}>
                        {renderPage(reference, data)}
                    </Tabs.TabPane>
                )
            })}
        </Tabs>
    ) : Ux.aiEmpty()
}