import React from 'react'
import {PageCard, TreeTable} from 'web';
import FormCat from './UI.Dialog.Cat';
import FormProd from './UI.Dialog.Procedure';
import FormAct from './UI.Dialog.Activity';
import Op from './Op';
import Ux from 'ux';
// 临时处理
import data from './data/data';

const Components = {
    $formCatFirst: FormCat,
    $formCatSecond: FormCat,
    $formCatThird: FormCat,
    $formActivity: FormAct,
    $formProd: FormProd,
};

const {zero} = Ux;

@zero(Ux.rxEtat(require("./Cab"))
    .cab("UI.Demo")
    .state({})
    .to()
)
class Component extends React.PureComponent {
    render() {
        const functions = Ux.valueFunction(Op.Functions)(this);
        return (
            <PageCard reference={this}>
                <TreeTable data={data}
                           reference={this}
                           $components={Components}
                           $functions={functions}/>
            </PageCard>
        )
    }
}

export default Component