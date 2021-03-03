import React from 'react';
import Ux from "ux";
import Top from "../Op";
import Ex from "ex";
import {Col, Row} from 'antd';

import renderTree from './UI.Tree';
import renderNav from './UI.Nav';
import UIForm from './UI.Form';

@Ux.zero(Ux.rxEtat(require("../Cab"))
    .cab("UI.Page4")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Top.yiStep4(this);
    }

    render() {
        return Ex.yoRender(this, () => {

            return (
                <div className={"ops-model-done"}>
                    <Row>
                        <Col span={5}>
                            {renderTree(this)}
                            {renderNav(this)}
                        </Col>
                        <Col span={19} className={"content-form"}>
                            {(() => {
                                const {data = {}} = this.props;
                                const {$inited = {}} = this.state;
                                return (
                                    <UIForm data={data} $inited={$inited}/>
                                )
                            })()}
                        </Col>
                    </Row>
                </div>

            )
        }, Ex.parserOfColor("PxPhase3").control())
    }
}

export default Component