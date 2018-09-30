import React from 'react'
import {TreeTable} from 'web';
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
    .cab("UI.Demo1")
    .tree(Tps.fnTreeData1)
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
        attrs.$inited = {key: "35eedb99-387b-4085-a435-9bcd26d78d12"};
        return (
            <TreeTable {...this.props}
                       {...attrs}/>
        )
    }
}

export default Component