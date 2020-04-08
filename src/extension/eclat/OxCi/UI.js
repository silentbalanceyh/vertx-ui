import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import Yi from './yi';
import './Cab.less';
import renderNav from './Web.Nav';
import renderPage from './Web.Tab';
import {Col, Row, Tag} from 'antd';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("ExCi")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Yi.yiCi(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Yi.yuCi(this, {props: prevProps, state: prevState});
    }

    render() {
        const header = Ux.fromHoc(this, "header");
        return (
            <div className={"ox-ci"}>
                <Row className={"nav"}>
                    <Col span={2}>
                        <Tag color={"magenta"}>{header.stack}</Tag>
                    </Col>
                    <Col span={22}>
                        {renderNav(this)}
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        {Ex.yoRender(this, () => {
                            return (
                                <div>
                                    {renderPage(this)}
                                </div>
                            )
                        }, Ex.parserOfColor("OxCi").component())}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Component;