import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {Col, Row} from 'antd';
import Jsx from './Web';

const componentInit = (reference) => {
    const state = {};
    Ux.ajaxGet("/api/role/by/sigma").then(response => {
        state.$roles = response;
        if (0 < response.length) {
            const $selected = {};
            $selected.key = response[0].key;
            $selected.type = "ROLE";
            $selected.data = response[0];
            state.$selected = $selected;
        }
        Ux.of(reference).in(state).ready().done();
        // reference.?etState(state);
        // state.$ready = true;
    })
}

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI.Role")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.ylCard(this, () => {
            return (
                <Row>
                    <Col span={4}>
                        {Jsx.renderMenu(this)}
                    </Col>
                    <Col span={20}>
                        {Jsx.renderContent(this)}
                    </Col>
                </Row>
            )
        }, Ex.parserOfColor("PxAuthorityRole").page())
    }
}

export default Component