import React from 'react';
import Ux from "ux";
import Ex from 'ex';
import Op from './Op';
import {Card, Col, Row} from 'antd';
import Rdr from './Web';
import Sk from 'skin';
import __ from './Cab.module.scss';

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.ylCard(this, () => {
            const info = Ux.fromHoc(this, "info");
            const attrs = Sk.mix(__.upg_integration_document);
            return (
                <Row {...attrs}>
                    <Col span={5} className={"left"}>
                        <div className={"ux_title"}>
                            {info.directory}
                        </div>
                        <Card className={"tree"}
                              bodyStyle={Ux.toHeightStyle(272)}
                              actions={Rdr.renderDirAction(this)}>
                            {Rdr.renderDirTree(this)}
                        </Card>
                    </Col>
                    <Col span={19} className={"content"}>
                        {Rdr.renderToolbar(this)}
                        {Rdr.renderNav(this)}
                        {Rdr.renderList(this)}
                    </Col>
                </Row>
            )
        }, Ex.parserOfColor("Document.Management").normalize());
    }
}

export default Component