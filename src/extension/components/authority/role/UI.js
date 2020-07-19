import React from 'react'
import Ux from "ux";
import Ex from "ex";
import Op from './Op';
import renderNav from './Web.Nav';
import renderSystem from './Web.System';
import './Cab.less';
import {Col, Row} from "antd";

@Ux.zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this)
    }

    render() {
        return Ex.ylCard(this, () => {
            const info = Ux.fromHoc(this, "info")

            return (
                <div className={"web-authority-role"}>
                    {renderNav(this)}
                    <Row className={"op-title"}>
                        <Col span={24}>
                            {info.system}
                        </Col>
                    </Row>
                    {renderSystem(this)}
                    <Row className={"op-title"}>
                        <Col span={24}>
                            {info.business}
                        </Col>
                    </Row>
                </div>
            )
        }, Ex.parserOfColor("PxAuthority-Role").page({
            extra: Ux.aiLinkBack(this)
        }))
    }
}

export default Component