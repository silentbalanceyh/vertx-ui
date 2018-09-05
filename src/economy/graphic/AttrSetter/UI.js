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
        const data = Rdr.prepareData(this, attributes.props, attributes.comment);
        const hoc = Rdr.prepareData(this, attributes.hoc, attributes.comment);
        // 属性设置
        const header = Ux.fromHoc(this, "header");
        const table = Ux.fromHoc(this, "table");
        Rdr.prepareRender(reference, table.left.columns);
        Rdr.prepareRender(reference, table.middle.columns);
        const attrs = {
            pagination: false,
            bordered: true
        };
        return (
            <PageCard reference={this}>
                <Row>
                    <Col span={10} className={"web-attr-header web-attr-container"}>
                        <span style={{
                            color: "#1b68b6"
                        }}>{header.left}</span>
                    </Col>
                    <Col span={14} className={"web-attr-header web-attr-container"}>
                        <span style={{
                            color: "#ff913a"
                        }}>{header.middle}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span={10} className={"web-attr-container"}>
                        <Table {...table.left} size="small"
                               dataSource={data} {...attrs}/>
                    </Col>
                    <Col span={14} className={"web-attr-container"}>
                        <Table {...table.middle} size="small"
                               dataSource={hoc} {...attrs}/>
                    </Col>
                </Row>
            </PageCard>
        )
    }
}

export default Component