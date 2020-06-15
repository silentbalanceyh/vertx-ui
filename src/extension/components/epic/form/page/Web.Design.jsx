import React from 'react';
import Yo from '../yo';
import Ex from 'ex';
import Ux from 'ux';
import {FormDesigner} from 'web';

@Ux.zero(Ux.rxEtat(require("../Cab"))
    .cab("UI.Form.Designer")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Yo.yiFormDesigner(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$models, raft} = this.state;
            return (
                <FormDesigner $models={$models} config={raft}
                              $height={172}
                              rxType={input => {

                              }}
                              rxApi={input => {

                              }}
                />
            );
        }, Ex.parserOfColor("FormDesigner").component())
    }
}

export default Component