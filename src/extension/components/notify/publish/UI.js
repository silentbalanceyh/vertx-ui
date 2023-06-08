import React from 'react';
import Ux from "ux";
import Ex from "ex";
import {ExForm} from "ei";
import Op from "./Op";

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI")
    .ready(true)
    .to()
)
class Component extends React.PureComponent {

    render() {
        /*
         * 配置处理
         */
        const {$inited = {}} = this.state;
        const form = Ex.yoForm(this, null, $inited);
        return Ex.ylCard(this, () => (
            <ExForm {...form} $height={"300px"}
                    $op={Op.actions}/>
        ), Ex.parserOfColor("PxPublish").page());
    }
}

export default Component;