import React from 'react';
import Ux from "ux";
import {Steps} from 'antd';
import './Cab.less';

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const helps = Ux.fromHoc(this, "helps");
        const {$step = 0} = this.props;
        return (
            <div className={"ops-model-step"}>
                <Steps current={$step}>
                    {helps.map(step => <Steps.Step {...step} key={Ux.randomUUID()}/>)}
                </Steps>
            </div>
        )
    }
}

export default Component