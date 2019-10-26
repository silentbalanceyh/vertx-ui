import React from 'react';
import Op from './Op';
import Ex from 'ex';
import Ux from 'ux';

const LOG = {
    name: "PxView",
    color: "#36648B"
};

@Ux.zero(Ux.rxEtat(require('../Cab'))
    .cab("UI.View")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiForm(this);
    }

    render() {
        return Ex.yoRender(this, () => {

            return false;
        }, LOG);
    }
}

export default Component;