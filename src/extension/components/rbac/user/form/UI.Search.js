import React from 'react'
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from "ei";
import {LoadingAlert} from 'web';
import Op from "./Op";

@Ux.zero(Ux.rxEtat(require('../Cab'))
    .cab("UI.Search")
    .raft(1)
    .form().to()
)
class Component extends React.PureComponent {
    render() {
        const alert = Ux.fromHoc(this, 'alert');
        const {$inited = {}} = this.props;
        const form = Ex.yoForm(this, null, $inited);
        return (
            <div>
                <LoadingAlert $alert={alert} $type={"error"}/>
                <ExForm {...form} $height={"200px"}
                        $op={Op.actions}/>
            </div>
        )
    }
}

export default Component