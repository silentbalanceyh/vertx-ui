import React from 'react';
import Ux from "ux";
import Ex from "ex";
import ExForm from "../ExForm/UI";

const UCA_NAME = "FDebtForm";
@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    render() {
        const {$inited = {}} = this.props;
        const form = Ex.yoForm(this, null, $inited);
        return (
            <ExForm {...form} $height={"300px"}/>
        )
    }
}

export default Component