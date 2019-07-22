import React from 'react'
import Ux from "ux";
import {ExForm} from 'ei';
import {LoadingAlert, PageCard} from 'web';
import Op from './Op';

const {zero} = Ux;

@zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const alert = Ux.fromHoc(this, "alert");

        const form = Op.yoForm(this);
        return (
            <PageCard reference={this}>
                <LoadingAlert $alert={alert}
                              $icon={"warning"}
                              $type={"warning"}
                              $size={40}/>
                <ExForm {...form} $height={"200px"}
                        $actions={Op.actions}/>
            </PageCard>
        )
    }
}

export default Component