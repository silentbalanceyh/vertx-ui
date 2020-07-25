import React from 'react'
import Ux from "ux";
import Ex from "ex";
import Op from './op';

import renderNav from './Web.Nav';
import renderSystem from './Web.System';
import renderBusiness from './Web.Business';

import './Cab.less';
import {Col, Row, Spin} from "antd";

@Ux.zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        window.addEventListener("resize", Ux.rxResize(this, Op.ADJUST));
        Op.yiPage(this)
    }

    componentWillUnmount() {
        window.removeEventListener("resize", Ux.rxResize(this, Op.ADJUST));
    }

    render() {
        return Ex.ylCard(this, () => {
            const info = Ux.fromHoc(this, "info")
            const {$submitting = false, __dialog} = this.state;
            return (
                <div className={"web-authority-role"}>
                    {__dialog.render()}
                    <Spin spinning={$submitting} tip={info.submitting}>
                        {renderNav(this)}
                        <Row>
                            <Col span={7}>
                                <Row className={"op-title"}>
                                    <Col span={24}>
                                        {info.business}
                                    </Col>
                                </Row>
                                {renderBusiness(this)}
                            </Col>
                            <Col span={17}>
                                <Row className={"op-title"}>
                                    <Col span={24}>
                                        {info.system}
                                    </Col>
                                </Row>
                                {renderSystem(this)}
                            </Col>
                        </Row>
                    </Spin>
                </div>
            )
        }, Ex.parserOfColor("PxAuthority-Role").page({
            extra: Ux.aiLinkBack(this)
        }))
    }
}

export default Component