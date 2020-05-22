import React from "react";
import Ex from 'ex';
import Op from './Op';

import Ux from "ux";
import renderJsx from './Web';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI")
    .connect(state => Ux.dataIn(state)
        .rework({datum: ["menus"]})
        .revamp(["app", "user"])
        .to()
    )
    .loading("app", "menus")
    .connect({
        fnApp: Ex.epicInit,
        fnOut: Ux.fnOut,
    }, true)
    .state({
        $collapsed: false,
        $ready: false,
    })
    .to())
class Component extends React.PureComponent {
    componentDidMount() {
        Ex.yiLayout(this)
            .then(state => Op.yiContainer(this, state))
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuContainer(this, {
            props: prevProps,
            state: prevState,
        })
    }

    render() {
        return Ex.yoRender(this, () =>
                renderJsx(this),
            Ex.parserOfColor("PxSwitcher").dynamic());
    }
}

export default Component;
