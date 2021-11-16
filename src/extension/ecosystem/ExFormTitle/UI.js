import React from 'react';
import './Cab.less'
import {Col, Row} from "antd";

class Component extends React.PureComponent {
    render() {
        const {value} = this.props;
        return (
            <Row>
                <Col span={21} offset={3} className={"ex-form-title"}>
                    {value}
                </Col>
            </Row>
        )
    }
}

export default Component