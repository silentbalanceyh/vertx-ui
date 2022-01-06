import React from 'react';
import Ux from "ux";
import Ex from "ex";
import ExForm from "../ExForm/UI";

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("FDebtForm")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const {$inited = {}} = this.props;
        const form = Ex.yoForm(this, null, $inited);
        return (
            <ExForm {...form} $height={"300px"}/>
        )
    }
}

export default Component