import React from 'react';
import Op from "./Op";
import './Cab.less';
import IxOpLink from '../IxOpLink/UI';

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
        return (
            <ul className={"ex-batch"}>
                {$op.map(link => <IxOpLink key={link.key} $config={link}
                                           {...this.props}/>)}
            </ul>
        );
    }
}

export default Component;