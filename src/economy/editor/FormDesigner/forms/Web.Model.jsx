import React from 'react';
import {component} from "../../../_internal";
import Ux from 'ux';
import {Col, Row, Table, Tag} from 'antd';

@component({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Model",
})
class Component extends React.PureComponent {
    render() {
        const {data = {}} = this.props;
        const config = Ux.fromHoc(this, "config");
        const {attributes = []} = data;
        const {table = {}} = config;
        const $table = Ux.clone(table);
        $table.columns = Ux.configColumn(this, $table.columns);
        return (
            <div className={"viewer-model"}>
                <Row className={"row"}>
                    <Col span={8}>
                        <label>{config.name}</label>：
                        <Tag color={"green"} style={{fontSize: 14}}>
                            {data.name}
                        </Tag>
                    </Col>
                    <Col span={8}>
                        <label>{config.category}</label>：
                        {data.category}
                    </Col>
                    <Col span={8}>
                        <label>{config.identifier}</label>：
                        {data.identifier}
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Table {...$table} dataSource={attributes}/>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Component