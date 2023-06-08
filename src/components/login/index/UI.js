import Ex from 'ex';
import React from "react";
import {ExEntry} from 'ei';
import Ux from 'ux';
import {Col, Row} from 'antd';
import Sk from 'skin';
import __ from './Cab.module.scss';

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const notice = Ux.fromPath(this, "comment", "notice");
        return (
            <Row>
                <Col span={4} xl={4} xxl={7}/>
                <Col span={16} xl={16} xxl={10} {...Sk.mix(__.hm_login_form, () => ({}))}>
                    <ExEntry {...Ex.yoAmbient(this)}/>
                    <div className={"notice"}>{notice}</div>
                </Col>
                <Col span={4} xl={4} xxl={7}/>
            </Row>
        );
    }
}

export default Component