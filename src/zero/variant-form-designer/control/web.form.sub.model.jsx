import React from 'react';
import {Col, Row, Table, Tag} from 'antd';
import __Zn from '../zero.uca.dependency';
import {uca} from 'zi';

@uca({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Sub.Model",
})
class Component extends React.PureComponent {
    render() {
        const {data = {}} = this.props;
        const config = __Zn.fromHoc(this, "config");
        const {attributes = []} = data;
        const {table = {}} = config;
        const $table = __Zn.clone(table);
        $table.columns = __Zn.configColumn(this, $table.columns);
        $table.pagination = {
            size: "small",
            pageSize: 10,
        }
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