import React from 'react';

import Ux from "ux";
import Ex from 'ex';
import Rdr from './Web';

import {Card, Empty} from 'antd';
import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "ExAnnounce";
const componentInit = (reference) => {
    const criteria = {"": true}; // AND
    criteria.status = "RUNNING";
    Ux.ajaxPost("/api/notice-dashboard", criteria).then(response => {
        const state = {};
        state.$ready = true;
        const data = Ux.valueArray(response);
        state.$data = data;
        state.$activeKey = data[0] ? data[0].key : undefined;
        Ux.of(reference).in(state).done();
        // reference.?etState(state);
    })
}

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {config = {}} = this.props;
            const {$data = []} = this.state;
            const attrCard = Sk.mixEx(UCA_NAME, null, {
                _className: Ux.Env.ECONOMY.CARD_CONTAINER
            });
            return (
                <Card title={config.title}
                      {...attrCard}
                      extra={Rdr.renderExtra(this)}>
                    {(() => {
                        if (0 === $data.length) {
                            return (
                                <Empty/>
                            )
                        } else {
                            return Rdr.renderNotice(this, $data);
                        }
                    })()}
                </Card>
            )
        }, Ex.parserOfColor(UCA_NAME).control())
    }
}

export default Component