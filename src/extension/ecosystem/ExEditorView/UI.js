import React from 'react';
import Ux from "ux";
import Ex from "ex";

// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const {config = {}} = reference.props;
    const $combine = Ex.yiCombine(reference, config);
    const state = {};
    state.$combine = $combine;
    state.$ready = true;
    reference.setState(state);
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("ExEditorView")
    .to()
)
class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            return (
                <div>
                    Tpl Hello World
                </div>
            )
        }, Ex.parserOfColor("ExEditorView").private())
    }
}

export default Component