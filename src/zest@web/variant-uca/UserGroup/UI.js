import React from 'react';
import {Col, Row} from 'antd';
import Op from './Op';
import Rdr from './Web';

import __Zn from '../zero.uca.dependency';
import {uca} from 'zi';

import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "UserGroup";
@uca({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
})
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        Op.componentInit(this);
    }

    render() {
        return __Zn.xtReady(this, () => {
            const attrGroup = Sk.mixUca(UCA_NAME);
            const WebField = __Zn.V4InputGroup;
            return (
                <WebField {...attrGroup}>
                    <Row>
                        <Col span={5} className={"group-filter"}>
                            {Rdr.renderType(this)}
                        </Col>
                        <Col span={19} className={"group-content"}>
                            {Rdr.renderChecked(this)}
                        </Col>
                    </Row>
                </WebField>
            )
        }, {name: UCA_NAME, logger: true})
    }
}

export default Component