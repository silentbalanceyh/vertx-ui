import React from 'react'
import './Cab.less';
import Ux from 'ux';
import Op from './Op';

const {zero} = Ux;
const jsx = {
    username: Ux.aiInput,
    password: Ux.aiInput
};

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .form().raft(jsx).bind(Op)
    .to()
)
class Component extends React.PureComponent {
    render() {
        const links = Ux.fromPath(this, "info", "links");
        return false;
    }
}

export default Component