import React from 'react';
import Ux from "ux";
import Ex from "ex";
import ExForm from '../ExForm/UI';
import FBillList from '../FBillList/UI';

const componentInit = (reference) => {
    const state = {};
    state.$ready = true;
    reference.setState(state);
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("FBookView")
    .to()
)
class Component extends React.PureComponent {
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
        }, Ex.parserOfColor("FBookView").view())
    }
}

export default Component