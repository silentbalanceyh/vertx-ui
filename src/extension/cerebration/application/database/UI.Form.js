import React from 'react';
import Ux from "ux";
import Ex from "ex";
import {ExForm, IxDatabase} from "ei";
import Op from "./Op";

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI.Form")
    .to()
)
class Component extends React.PureComponent {
    render() {
        // 从 Localhost中提取数据
        const {$inited = {}} = this.props;
        const form = Ex.yoForm(this, null, {configDatabase: $inited});
        console.log(form);
        return (
            <ExForm {...form} $op={Op.actions} $renders={{
                configDatabase: (reference, jsx) => {
                    return (<IxDatabase reference={reference} {...jsx}/>)
                },
            }}/>
        )
    }
}

export default Component