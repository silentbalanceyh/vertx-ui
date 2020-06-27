import React from 'react';
import Ux from 'ux';
import Ex from "ex";
import {ExComplexList} from "ei";
import Op from './Op';
import {Col, Row} from "antd";
import renderTree from "./Web.Tree";

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
            const listAttrs = Op.yoResList(this);
            const {$opened = false} = this.state;
            const {$tree = []} = this.props;
            const span = $opened ? {left: 0, right: 24} : {left: 5, right: 19};
            return (
                <Row className={"web-authority-resource"}>
                    <Col span={span.left}>
                        {renderTree(this, $tree)}
                    </Col>
                    <Col span={span.right} className={"content"}>
                        <ExComplexList {...listAttrs}/>
                    </Col>
                </Row>

            )
        }, Ex.parserOfColor("PxUserList").control());
    }
}

export default Component