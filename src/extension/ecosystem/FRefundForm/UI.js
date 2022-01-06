import React from 'react';
import Ux from "ux";
import Ex from "ex";
import ExForm from "../ExForm/UI";

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("FRefundForm")
    .to()
)
class Component extends React.PureComponent {
    render() {
        let {$inited = {}} = this.props;
        $inited = Ux.clone($inited);
        $inited.amount = Math.abs($inited.amount);
        const form = Ex.yoForm(this, null, $inited);
        return (
            <ExForm {...form} $height={"300px"}/>
        )
    }
}

export default Component