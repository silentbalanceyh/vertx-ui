import React from 'react';
import Ux from 'ux';
import Ex from "ex";
import {ExListComplex} from "ei";
import Op from './op/Op';
import jsx from "./Web.Tree";
import {Col, Row} from "antd";

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI.Res.List")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiResPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {
                $opened = false,
                $tree = []
            } = this.state ? this.state : {};
            const span = $opened ? {left: 0, right: 24} : {left: 5, right: 19};
            const listAttrs = Op.yoResList(this);
            return (
                <Row className={"web-authority-resource"}>
                    <Col span={span.left}>
                        {jsx.treeResource(this, $tree)}
                    </Col>
                    <Col span={span.right} className={"content"}>
                        <ExListComplex {...listAttrs}/>
                    </Col>
                </Row>
            )
        }, Ex.parserOfColor("PxResourceList").control());
    }
}

export default Component