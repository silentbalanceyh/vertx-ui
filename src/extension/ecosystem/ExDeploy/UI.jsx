import React from 'react';
import {LoadingAlert} from "web";
import Ux from 'ux';
import {Col, Icon, Row, Statistic} from 'antd';
import './Cab.less';
import renderGraph from './GI.graph';

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("ExDeploy")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        const {step} = this.props;
        renderGraph(this, step);
    }

    render() {
        const {alert, step = 1} = this.props;
        return (
            <div>
                {(() => {
                    const header = Ux.fromHoc(this, "header");
                    const content = header.title[step];
                    if (content) {
                        const {value, icon} = content;
                        return (
                            <Row className={"ex-ppt"}>
                                <Col span={24}>
                                    <Statistic title={header.prefix} value={value}
                                               prefix={<Icon type={icon}/>}/>
                                </Col>
                            </Row>
                        )
                    } else return false;
                })()}
                {alert ? (<LoadingAlert $alert={alert}/>) : false}
                <div id={"divPpt"}/>
            </div>
        )
    }
}

export default Component