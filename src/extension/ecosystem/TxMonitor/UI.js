import React from 'react';
import Ux from "ux";
import ExTab from '../ExTab/UI';
import ExBpmn from '../ExBpmn/UI';
import TxHistory from '../TxHistory/UI';

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("TxMonitor")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const tabs = Ux.fromHoc(this, "tabs");
        const {data = {}} = this.props;
        const {$bpmn = {}, $history = []} = data;
        return (
            <ExTab config={tabs}>
                <ExBpmn {...$bpmn}/>
                <TxHistory data={$history}/>
            </ExTab>
        )
    }
}

export default Component