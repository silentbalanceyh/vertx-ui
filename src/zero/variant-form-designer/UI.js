import React from 'react';
import {Col, Row, Spin} from 'antd';
import Op from './op';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

import {LoadingContent, uca} from 'zi';

import Rdr from './component'
import renderCanvas from './canvas';
import __Zn from './zero.uca.dependency';


@uca({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
})
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return __Zn.xtReady(this, () => {
            const {$forbidden = false} = this.state;
            return (
                <div className={"web-form-designer"}>
                    <Row>
                        <Col span={24}>
                            {Rdr.renderCmds(this)}
                        </Col>
                    </Row>
                    <Spin spinning={$forbidden} indicator={null} onClick={Op.rxSpinOff(this)}>
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
        }, {
            component: LoadingContent,
            name: "FormDesigner",
            logger: true,
        })
    }
}

export default Component