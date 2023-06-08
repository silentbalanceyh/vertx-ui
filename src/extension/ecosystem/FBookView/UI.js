import React from 'react';
import Ux from "ux";
import Ex from "ex";
import ExForm from '../ExForm/UI';
import FBillList from '../FBillList/UI';

const UCA_NAME = "FBookView";
const componentInit = (reference) => {
    const state = {};
    Ux.of(reference).in(state).ready().done();
    // reference.?etState(state);
    // state.$ready = true;
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        componentInit(this)
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$inited = {}} = this.props;
            const {children = [], ...initValues} = $inited;
            const form = Ex.yoForm(this, null, initValues);
            const $form = {};
            const inherit = Ex.yoAmbient(this);
            return (
                <div>
                    <ExForm {...form} $height={"300px"}
                            $form={$form}/>
                    <FBillList {...inherit} data={children}/>
                </div>
            );
        }, Ex.parserOfColor(UCA_NAME).view())
    }
}

export default Component