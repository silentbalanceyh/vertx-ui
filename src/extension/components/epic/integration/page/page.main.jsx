import Ux from "ux";
import {Col, Row, Table} from "antd";
import React from "react";
import renderTool from "./page.main.tool";
import renderMenu from './page.main.menu';
import {ExDeploy} from "ei";

export default (reference) => {
    const {
        $table = {}, $loading = false,
        $pagination = {}, $data = []
    } = reference.state;

    const configTable = Ux.clone($table);
    Ux.configScroll(configTable, $data, reference);
    configTable.pagination = $pagination;
    return (
        <Row>
            <Col span={4}>
                <div style={{
                    maxHeight: Ux.toHeight(106),
                    overflow: "auto",
                    paddingRight: 6
                }}>
                    {renderMenu(reference)}
                </div>
            </Col>
            <Col span={20} className={"api-content"}>
                <Row>
                    <ExDeploy $width={880} step={3}/>
                </Row>
                <Row>
                    <Col span={24}>
                        {renderTool(reference)}
                    </Col>
                </Row>
                <Row>
                    <Col span={24} className={"api-table"}>
                        <Table {...configTable}
                               dataSource={$data} loading={$loading}/>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}