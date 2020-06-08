import Ux from "ux";
import {LoadingAlert} from "web";
import {Col, Row, Table} from "antd";
import React from "react";
import renderTool from "./page.main.tool";
import renderMenu from './page.main.menu';

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
            {renderTool(reference)}
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
                <Col span={20} className={"job-table"}>
                    <Table {...configTable} dataSource={$data} loading={$loading}/>
                </Col>
            </Row>
        </div>
    )
}