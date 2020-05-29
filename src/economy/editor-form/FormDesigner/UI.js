import React from 'react';
import './Cab.less';
import {component} from "../../_internal";
import {Col, Row, Spin} from 'antd';
import Op from './op';
import Ux from 'ux';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

import LoadingContent from '../../loading/LoadingContent/UI';

import Rdr from './component'
import renderCanvas from './canvas';

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
            const {$forbidden = false} = this.state;
            return (
                <div className={"web-form-designer"}>
                    <Row>
                        <Col span={24}>
                            {Rdr.renderCmds(this)}
                        </Col>
                    </Row>
                    <Spin spinning={$forbidden} indicator={null} onClick={Op.onSpin(this)}>
                        <DndProvider backend={HTML5Backend}>
                            <Row>
                                <Col span={4} className={"content-left"}>
                                    {Rdr.renderPalette(this)}
                                </Col>
                                <Col span={20}>
                                    {Rdr.renderStatus(this)}
                                    {renderCanvas(this)}
                                </Col>
                            </Row>
                        </DndProvider>
                    </Spin>
                </div>
            )
        }, {component: LoadingContent})
    }
}

export default Component