import React from 'react';
import Ux from "ux";
import Ex from "ex";
import {Button, Col, Row} from 'antd';
import './Cab.less';
import Rdr from './renders';

const componentInit = (reference) => {
    Ux.ajaxGet("/api/bag").then(response => {
        const state = {};
        state.$ready = true;
        // 一级 BAG 包列表
        state.$dataDir = response
            .filter(item => !item.parentId)
            .sort(Ux.sorterAscTFn("uiSort"));
        // 二级 BAG 包列表
        state.$dataBag = response
            .filter(item => !!item.parentId)
            .sort(Ux.sorterAscTFn("uiSort"));
        // BLOCK在二级子包中
        reference.setState(state);
    })
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.ylCard(this, () => {
            // 面板处理
            const panel = Ux.fromHoc(this, "panel");
            const action = Ux.fromHoc(this, "action");
            const {$selectedBag, $selectedBlock} = this.state;
            return (
                <div className={"dx-module"}>
                    <Row>
                        <Col span={24} className={"ux-title ux-title-pure"}>
                            {panel['bag']}
                            <div className={"extra-action"}>
                                <Button icon={"plus"} className={"ux-spec"}>
                                    {action['bag']}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    {Rdr.renderBag(this)}
                    <Row>
                        <Col span={24} className={"ux-title ux-title-pure"}>
                            {panel['block']}
                            <div className={"extra-action"}>
                                <Button icon={"plus"} className={"ux-spec"}
                                        disabled={!($selectedBag && $selectedBlock)}>
                                    {action['block']}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    {Rdr.renderBlock(this)}
                </div>
            )
        }, Ex.parserOfColor("Application.Module").toolkit())
    }
}

export default Component