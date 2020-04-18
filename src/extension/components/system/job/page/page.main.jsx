import Ux from "ux";
import {LoadingAlert} from "web";
import {Col, Row, Table} from "antd";
import React from "react";
import renderTool from "./page.main.tool";
import renderMenu from './page.main.menu';

const toData = (reference) => {
    const {
        $searchText, $data = [],
        $searchPrefix,
        $searchChecked = []
    } = reference.state;
    let dataSource = [];

    // 文本过滤
    if ($searchText) {
        dataSource = $data.filter(item => (0 <= item.name.indexOf($searchText)));
    } else {
        dataSource = $data;
    }

    // 前缀树选择
    if ($searchPrefix) {
        dataSource = dataSource.filter(item => item.code.startsWith($searchPrefix));
    }

    // 多状态选择
    if (0 < $searchChecked.length) {
        const $keys = Ux.immutable($searchChecked);
        dataSource = dataSource.filter(item => $keys.contains(item.status));
    }
    return dataSource;
}

export default (reference) => {
    const {
        $table = {}, $loading = false,
    } = reference.state;

    const alert = Ux.fromHoc(reference, "alert");
    const dataSource = toData(reference);

    const configTable = Ux.clone($table);
    Ux.configScroll(configTable, dataSource, reference);
    return (
        <div>
            <LoadingAlert $alert={alert} $type={"success"}/>
            {renderTool(reference)}
            <Row>
                <Col span={4}>
                    {renderMenu(reference)}
                </Col>
                <Col span={20}>
                    <Table {...configTable} dataSource={dataSource} loading={$loading}/>
                </Col>
            </Row>
        </div>
    )
}