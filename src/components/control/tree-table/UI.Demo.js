import React from 'react'
import {PageCard, TreeTable} from 'web';
import FormCat from './UI.Dialog.Cat';
import FormProd from './UI.Dialog.Procedure';
import FormAct from './UI.Dialog.Activity';
import Op from './Op';
import Ux from 'ux';
import {Tps} from 'app';
// 临时处理

const Components = {
    $formCatFirst: FormCat,
    $formCatSecond: FormCat,
    $formCatThird: FormCat,
    $formActivity: FormAct,
    $formProcedure: FormProd,
};

const {zero} = Ux;

@zero(Ux.rxEtat(require("./Cab"))
    .cab("UI.Demo")
    .tree(Tps.fnTreeData)
    .state({})
    .to()
)
class Component extends React.PureComponent {
    render() {
        const functions = Ux.valueFunction(Op.Functions)(this);
        const attrs = {};
        attrs.reference = this;
        attrs.$components = Components;
        attrs.$functions = functions;
        attrs.$inited = {key: "501c4240-aff2-4949-aca7-b15408840f8b"};
        return (
            <PageCard reference={this}>
                <TreeTable {...this.props}
                           {...attrs}/>
            </PageCard>
        )
    }
}

export default Component