import React from 'react'
import Ux from 'ux'
import {LoadingContent, PageCard} from "web";
import {Col, Row} from 'antd';

const {zero} = Ux;

@zero(Ux.rxEtat(require("./Cab"))
    .cab("UI.Demo")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const loading = Ux.fromHoc(this, "_configuration");
        return (
            <PageCard reference={this}>
                <Row>
                    {loading.map(item => {
                        const {span, attrs = {}} = item;
                        return (
                            <Col key={Ux.randomUUID()} span={span}>
                                <LoadingContent {...attrs}/>
                            </Col>
                        )
                    })}
                </Row>
            </PageCard>
        )
    }
}

export default Component;