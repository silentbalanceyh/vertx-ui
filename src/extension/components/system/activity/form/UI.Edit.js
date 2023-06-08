import React from 'react';
import Ux from "ux";
import Ex from "ex";
import {ExForm} from "ei";

@Ux.zero(Ux.rxEtat(require('../Cab'))
    .cab("UI.Edit")
    .to()
)
class Component extends React.PureComponent {
    render() {
        /*
         * 配置处理
         */
        const {$inited = {}} = this.props;
        const form = Ex.yoForm(this, null, $inited);
        return (
            <ExForm {...form} $height={"300px"}/>
        );
    }
}

export default Component;