import React from 'react'
import {TreeTable} from 'web';
import FormCat from './UI.Demo.Dialog.Cat';
import FormProd from './UI.Demo.Dialog.Procedure';
import Op from './Op';
import Ux from 'ux';
import {Tps} from 'app';
// 临时处理

const Components = {
    $formCatFirst: FormCat,
    $formCatSecond: FormCat,
    $formCatThird: FormCat,
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
            <TreeTable {...this.props}
                       {...attrs}/>
        )
    }
}

export default Component