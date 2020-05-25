import React from 'react';
import './Cab.less';
import {component} from "../../_internal";
import {Col, Row} from 'antd';
import Op from './op';
import Ux from 'ux';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

import LoadingContent from '../../loading/LoadingContent/UI';

import renderCmd from './Web.Command';
import renderPalette from './Web.Palette';
import renderEditor from './Web.Editor';

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
                    <DndProvider backend={HTML5Backend}>
                        <Row>
                            <Col span={4}>
                                {renderPalette(this)}
                            </Col>
                            <Col span={20}>
                                {renderEditor(this)}
                            </Col>
                        </Row>
                    </DndProvider>
                </div>
            )
        }, {component: LoadingContent})
    }
}

export default Component