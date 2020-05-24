import React from 'react';
import './Cab.less';
import {component} from "../../_internal";
import {Col, Row} from 'antd';
import Op from './op';
import Ux from 'ux';

import LoadingContent from '../../loading/LoadingContent/UI';

import renderCmd from './Web.Command';
import renderPalette from './Web.Palette';

@component({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
})
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ux.xtReady(this, () => {
            return (
                <div className={"web-form-designer"}>
                    <Row>
                        <Col span={24}>
                            {renderCmd(this)}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4}>
                            {renderPalette(this)}
                        </Col>
                        <Col span={20}>

                        </Col>
                    </Row>
                </div>
            )
        }, {component: LoadingContent})
    }
}

export default Component