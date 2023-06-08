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

    const alert = Ux.fromHoc(reference, "alert");

    const configTable = Ux.clone($table);
    Ux.configScroll(configTable, $data, reference);
    configTable.pagination = $pagination;
    return (
        <div>
            <ExDeploy alert={alert} $width={1050} step={4}/>
            {renderTool(reference)}
            <Row>
                <Col span={4}>
                    {renderMenu(reference)}
                </Col>
                <Col span={20} className={"job-table"}>
                    <Table {...configTable} dataSource={$data} loading={$loading}/>
                </Col>
            </Row>
        </div>
    )
}