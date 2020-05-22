import Ex from 'ex';
import React from "react";
import {ExEntry} from 'ei';
import './Cab.less';
import Ux from 'ux';
import {Col, Row} from 'antd';

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const info = Ux.fromPath(this, "info");
        return (
            <Row>
                <Col span={4} xl={3} xxl={4}/>
                <Col span={16} xl={18} xxl={20} className={"login-form"}>
                    <label className={"title"}>{info.title}</label>
                    <ExEntry {...Ex.yoAmbient(this)}/>
                    <ul className={"notice"}>
                        {info.links.map(link => {
                            return (
                                <li key={link.uri}>{link.text}：
                                    <a href={link.uri} target={"_blank"} rel="noopener noreferrer">
                                        {link.uri}
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                </Col>
                <Col span={4} xl={3} xxl={4}/>
            </Row>
        );
    }
}

export default Component