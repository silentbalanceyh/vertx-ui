import React from 'react'
import Ux from "ux";
import {ExTab} from 'ei';
import Ex from 'ex';

import PageWizard from './UI.Wizard';
import PageEdit from './UI.Edit';
import PageDesigner from './UI.Designer';

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .ready(true)
    .to()
)

class Component extends React.PureComponent {
    render() {
        const tabs = Ux.fromHoc(this, "tabs");
        /*
         * Ex部分的状态处理
         */
        const inherit = Ex.yoAmbient(this);
        return Ex.ylCard(this, () => (
            <ExTab {...inherit} config={tabs}>
                <PageWizard {...inherit}/>
                <PageEdit {...inherit}/>
                <PageDesigner {...inherit}/>
            </ExTab>
        ), Ex.parserOfColor("PxForm").page())
    }
}

export default Component