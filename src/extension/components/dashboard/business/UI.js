import React from 'react';

import Ux from "ux";
import Sk from "skin";
import __ from "./Cab.module.scss";
import {Col, Row} from "antd";
import Ex from "ex";
import {ExAnnounce} from "ei";
import UiApp from './UI.App';

const renderNotice = (reference) => {
    const attrs = Ex.yoAmbient(reference);
    attrs.config = Ux.fromHoc(reference, "notice");
    return (
        <ExAnnounce {...attrs}/>
    )
}

@Ux.zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const attrPage = Sk.mix(__.upg_dashboard_business);
        const attrs = {
            className: "xc_row"
        };
        const inherit = Ex.yoAmbient(this);
        return (
            <div {...attrPage}>
                <Row {...attrs}>
                    <Col span={24}>
                        {/* 公告栏 */}
                        {renderNotice(this)}
                    </Col>
                </Row>
                <UiApp {...inherit}/>
            </div>
        )
    }
}

export default Component