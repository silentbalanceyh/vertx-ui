import React from 'react'
import Ux from "ux";
import {ExTab} from 'ei';
import Ex from 'ex';

import FormCompany from './UI.Company';
import ListCompany from './UI.List';

const LOG = {
    name: "PxCompany",
    color: "#36648B"
};

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .to()
)

class Component extends React.PureComponent {
    componentDidMount() {
        Ex.init(this).company();
    }

    render() {
        return Ex.yoRender(this, () => {
            const tabs = Ux.fromHoc(this, "tabs");
            /*
             * Ex部分的状态处理
             */
            const inherit = Ex.yoAmbient(this);
            const {$inited = {}} = this.state;
            return Ex.ylCard(this, () => (
                <ExTab {...inherit} config={tabs}>
                    <FormCompany {...inherit} $inited={$inited}/>
                    <ListCompany {...inherit} $inited={$inited}/>
                </ExTab>
            ))
        }, LOG);
    }
}

export default Component