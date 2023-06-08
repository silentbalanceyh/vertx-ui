import React from 'react';

import {Col, Input, Row} from 'antd';
import __Zn from '../zero.uca.dependency';
import Op from './Op';
import Rdr from './Web';
import './Cab.norm.scss';
import Sk from 'skin';

const UCA_NAME = "InputCaptcha";
const componentInit = (reference) => {
    const state = {};
    const {config = {}, $session} = reference.props;
    const {type = "image"} = config;
    if ("image" === type) {
        // Initialized Session When Enable Captcha
        Op.asyncImage(config, $session, reference).then(response => {
            state.$image = response;

            __Zn.of(reference).in(state).ready().done();
            // reference.?etState(state);
            // state.$ready = true;
        }).catch(Op.rxError(config, reference))
    } else {
        console.warn("其他模式还不支持")
    }
}

const componentUp = (reference, virtual = {}) => {
    const current = reference.props.$session;
    const previous = virtual.props.$session;
    if (previous && current && previous !== current) {
        Op.rxRefresh(reference);
    }
}

class Component extends React.PureComponent {
    displayName = UCA_NAME;

    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentUp(this, {props: prevProps});
    }

    render() {
        return __Zn.xtReady(this, () => {
            const {config = {}, ...rest} = this.props;
            const inputAttrs = __Zn.yoLimit(rest, [
                "$session"
            ]);
            const WebField = __Zn.V4InputGroup;
            return (
                <WebField {...Sk.mixUca(UCA_NAME)}>
                    <Row>
                        <Col span={12}>
                            <Input {...inputAttrs}/>
                        </Col>
                        <Col span={12}>
                            {(() => {
                                const {type = "image"} = config;
                                const renderFn = Rdr[type];
                                if (__Zn.isFunction(renderFn)) {
                                    return renderFn(this);
                                } else {
                                    return false;
                                }
                            })()}
                        </Col>
                    </Row>
                </WebField>
            )
        }, {name: UCA_NAME, logger: true})
    }
}

export default Component