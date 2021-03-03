import React from 'react';
import {Col, Row} from 'antd';
import Ex from 'ex';
import {OpsSource, OpsSourceList, OpsViewSource} from 'app';

class Component extends React.PureComponent {
    render() {
        return (
            <Row>
                <Col span={5}>
                    <OpsSource {...Ex.yoAmbient(this)}/>
                </Col>
                <Col span={19} className={"ops-range"}>
                    <OpsViewSource {...Ex.yoAmbient(this)}/>
                    <OpsSourceList {...Ex.yoAmbient(this)}/>
                </Col>
            </Row>
        )
    }
}

export default Component