import React from 'react'
import './Cab.less'
import Ux from 'ux';
import {Col, Row, Table} from 'antd';
import {_zero} from "../../_internal";
import PageCard from '../../page/PageCard/UI';
import Rdr from './UI.Render';

@_zero({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI"
})
class Component extends React.PureComponent {
    render() {
        const {reference} = this.props;
        const attributes = Ux.fromHoc(reference, "attribute");
        const data = Rdr.prepareData(this, attributes.props);
        // 属性设置
        const header = Ux.fromHoc(this, "header");
        const table = Ux.fromHoc(this, "table");
        Rdr.prepareRender(reference, table.left.columns);
        return (
            <PageCard reference={this}>
                <Row>
                    <Col span={8} className={"web-attr-header web-attr-container"}>
                        <span style={{
                            color: "#1b68b6"
                        }}>{header.left}</span>
                    </Col>
                    <Col span={8} className={"web-attr-header web-attr-container"}>
                        <span style={{
                            color: "#ff913a"
                        }}>{header.middle}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span={8} className={"web-attr-container"}>
                        <Table {...table.left} pagination={false} dataSource={data}/>
                    </Col>
                    <Col span={8} className={"web-attr-container"}>
                        <Table {...table.middle} pagination={false}/>
                    </Col>
                </Row>
            </PageCard>
        )
    }
}

export default Component