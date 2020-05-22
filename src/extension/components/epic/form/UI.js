import React from 'react'
import Ux from "ux";
import Ex from 'ex';
import Yo from './yo';
import './Cab.less';

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .to()
)

class Component extends React.PureComponent {

    componentDidMount() {
        Yo.yiPage(this);
    }

    render() {
        const {__tabs} = this.state;
        return Ex.ylCard(this,
            () => __tabs.render(),
            Ex.parserOfColor("PxForm").page())
    }
}

export default Component