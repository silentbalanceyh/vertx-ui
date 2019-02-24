import React from 'react';
import './Cab.less';
import GGEditor, {Koni} from 'gg-editor';
import {Col, Row} from 'antd';
import Rdr from './UI.Render';
import {_zero} from "../../_internal";
import Op from './Op';
// 自定义组件
import KoniCustomNode from './control/KoniCustomNode';
import EditorMinimap from '../EditorMinimap/UI';

@_zero({
    "i18n.cab": require('./Cab'),
    "i18n.name": "UI",
    state: {
        // 工具栏配置
        $toolbars: []
    }
})
class Component extends React.PureComponent {
    componentDidMount() {
        // 初始化工具栏
        Op.initDesigner(this);
    }

    render() {
        const {$minimap = {}} = this.state;
        return (
            <GGEditor className={"editor"}>
                <Row type={"flex"} className={"editor-hd"}>
                    <Col span={24}>
                        {/** 工具栏 **/}
                        {Rdr.renderTool(this)}
                    </Col>
                </Row>
                <Row type={"flex"} className={"editor-bd"}>
                    <Col span={4} className={"editor-sidebar"}>
                        {/** 左边被拖拽的拓扑图标 **/}
                        {Rdr.renderItemPanel(this)}
                    </Col>
                    <Col span={16} className={"editor-content"}>
                        <Koni className={"koni"}/>
                    </Col>
                    <Col span={4} className={"editor-sidebar"}>
                        Detail <br/>
                        {/** 缩略图 **/}
                        <EditorMinimap $config={$minimap}/>
                    </Col>
                </Row>
                <KoniCustomNode/>
            </GGEditor>
        );
    }
}

export default Component;