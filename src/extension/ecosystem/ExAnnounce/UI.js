import React from 'react';
import './Cab.less';
import Ux from "ux";
import Ex from 'ex';
import Rdr from './Web';

import {Card, Empty} from 'antd'

const componentInit = (reference) => {
    const criteria = {};
    criteria.status = "RUNNING";
    Ux.ajaxPost("/api/x-notice/search", {criteria}).then(response => {
        const state = {};
        state.$ready = true;
        state.$data = Ux.valueArray(response);
        // $dialog
        const dialog = Ux.fromHoc(reference, "window");
        state.$dialog = Ux.configDialog(reference, dialog);
        try {
            reference.setState(state);
        } catch (error) {
        }
    })
}

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("ExAnnounce")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {config = {}} = this.props;
            const {$data = []} = this.state;
            return (
                <Card title={config.title}
                      className={`${Ux.Env.ECONOMY.CARD_CONTAINER} ex-announce`}>
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
        }, Ex.parserOfColor("ExAnnounce").control())
    }
}

export default Component