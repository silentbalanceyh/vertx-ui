import React from 'react';
import {Col, Row} from "antd";

const UCA_NAME = "ExFormTitle";
class Component extends React.PureComponent {
    displayName = UCA_NAME;
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