import React from 'react';
import Op from "./Op";
import './Cab.less';
import IxOpLink from '../IxOpLink/UI';
import Ux from "ux";

class Component extends React.PureComponent {
    state = {
        op: []
    };

    componentDidMount() {
        Op.init(this);
    }

    render() {
        const {op = []} = this.state;
        const $op = Op.configOp(this, op);
        Ux.dgDebug({
            props: this.props,
            state: this.state,
        }, "[Ex] IxOpBatch：", "#f66");
        return (
            <ul className={"ex-batch"}>
                {$op.map(link => <IxOpLink key={link.key} $config={link}
                                           {...this.props}/>)}
            </ul>
        );
    }
}

export default Component;