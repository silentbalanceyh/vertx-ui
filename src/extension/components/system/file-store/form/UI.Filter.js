import React from 'react'
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from "ei";
import Op from "./Op";

@Ux.zero(Ux.rxEtat(require('../Cab.json'))
    .cab("UI.Ftp.Filter")
    .raft(1)
    .form().to()
)
class Component extends React.PureComponent {
    render() {

        const {$inited = {}} = this.props;
        const form = Ex.yoForm(this, null, $inited);
        return (
            <ExForm {...form} $height={"200px"}
                    $op={Op.actions}/>
        )
    }
}

export default Component