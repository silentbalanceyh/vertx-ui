import React from 'react';
import {component} from "../../../_internal";
import Ux from 'ux';
import {Col, Row, Tag} from 'antd';

@component({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Model",
})
class Component extends React.PureComponent {
    render() {
        const {data = {}} = this.props;
        const config = Ux.fromHoc(this, "config");
        return (
            <div className={"model-viewer"}>
                <Row>
                    <Col span={8}>
                        {config.name}：{data.name}
                    </Col>
                    <Col span={8}>
                        {config.category}：
                        <Tag color={"geekblue"} style={{fontSize: 14}}>
                            {data.category}
                        </Tag>
                    </Col>
                    <Col span={8}>
                        {config.identifier}：
                        {data.identifier}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Component