import React from 'react';
import Ux from 'ux';
import Ex from "ex";
import Op from './Op';
import {Fn} from 'app';

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiInit(this);
    }

    render() {
        return Ex.yoRender(this, () => Fn.jsxCard(this,
            () => Fn.jsxForm(this)
        ), Ex.parserOfColor("OpsViewModelMap").define())
    }
}

export default Component