import Ux from "ux";
import {Col, Statistic, Table} from "antd";
import React from "react";
import {G2Bar} from "ei";

import Sk from 'skin';
import __ from './Cab.module.scss';

export default {
    renderTable: (reference) => {
        const {$data = []} = reference.state;
        let table = Ux.fromHoc(reference, "table");
        table.columns = Ux.configColumn(reference, table.columns);
        table.columns.forEach(column => {
            if ("link" === column.dataIndex) {
                column.render = (text, record = {}) => {
                    return (
                        // eslint-disable-next-line
                        <a href={"#"} onClick={event => {
                            Ux.prevent(event);
                            // 根据 flowInstanceId 读取 workflow
                            const name = record.flowDefinitionKey;
                            const {$router} = reference.props;
                            const target = $router.path()
                            Ux.toRoute(reference, `/workflow/run`, {
                                name, _tid: record.key,
                                target,
                            });
                        }}>
                            {record.icon ? Ux.v4Icon(record.icon) : false}
                            &nbsp;&nbsp;
                            {record.name}
                        </a>
                    );
                }
            }
        })
        const attrTable = Sk.mix(__.upg_todo_pending, null, {
            _className: "ux_table"
        });
        Object.assign(table, attrTable);
        return (
            <Table {...table} dataSource={$data}/>
        )
    },
    renderStatistic: (reference) => {
        const {$statistic = []} = reference.state;
        return $statistic.map(item => (
            <Col key={item.key} span={6}>
                <Statistic title={item.title} value={item.value}
                           prefix={
                               Ux.v4Icon(item.icon, {
                                   style: {color: item.color}
                               })
                           }/>
            </Col>
        ));
    },
    renderBar: (reference) => {
        const {$graph = {}} = reference.state;
        const {config = {}, data = []} = $graph;
        // 最大值计算
        config.scale = {
            value: {
                max: Ux.g2ScaleMax(data)
            }
        };
        // 内容呈现
        config.interval = {
            label: {
                content: (item) => item.value,
            }
        }
        config.legend = false;
        return (<G2Bar id={"divPending"}
                       config={config}
                       data={data}
                       style={{
                           height: 180,
                       }}/>)
    }
}