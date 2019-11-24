import React from 'react';
import {Col, Row, Table, Tabs} from 'antd';
import Ux from 'ux';
import Ex from "ex";
import RelForm from './UI.Selector';

const renderPage = (reference, data) => {
    const table = Ux.fromHoc(reference, "table");
    const $table = Ux.clone(table);
    $table.columns = Ux.configColumn(reference, table.columns);
    $table.pagination = false;
    $table.className = "web-table ex-relation-table";
    const {config = {}} = reference.props;
    /*
     * 窗口配置
     */
    return (
        <div className={"ex-relation-body"}>
            {config.editable ? (
                <Row>
                    <Col span={24} className={"row-op"}>
                        {Ux.sexModal(reference, "op", () => {
                            const inherit = Ex.yoAmbient(reference);
                            inherit.$mode = Ux.Env.FORM_MODE.ADD;
                            inherit.rxClose = Ex.rsVisible(reference, false);
                            return (
                                <RelForm {...inherit}/>
                            )
                        })}
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