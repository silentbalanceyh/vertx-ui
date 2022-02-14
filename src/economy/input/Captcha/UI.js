import React from 'react';
import './Cab.less';
import {Col, Input, Row} from 'antd';
import Ux from "ux";
import Op from './Op';
import Rdr from './Web';

const componentInit = (reference) => {
    const state = {};
    const {config = {}, $session} = reference.props;
    const {type = "image"} = config;
    if ("image" === type) {
        // Initialized Session When Enable Captcha
        Op.asyncImage(config, $session).then(response => {
            state.$image = response;
            state.$ready = true;
            reference.setState(state);
        })
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
    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentUp(this, {props: prevProps});
    }

    render() {
        return Ux.xtReady(this, () => {
            const {config = {}, ...rest} = this.props;
            const inputAttrs = Ux.toLimit(rest, [
                "reference",
                "$session"
            ])
            return (
                <Input.Group className={"web-captcha"}>
                    <Row>
                        <Col span={12}>
                            <Input {...inputAttrs}/>
                        </Col>
                        <Col span={12}>
                            {(() => {
                                const {type = "image"} = config;
                                const renderFn = Rdr[type];
                                if (Ux.isFunction(renderFn)) {
                                    return renderFn(this);
                                } else {
                                    return false;
                                }
                            })()}
                        </Col>
                    </Row>
                </Input.Group>
            )
        }, {name: "Captcha", logger: true})
    }
}

export default Component