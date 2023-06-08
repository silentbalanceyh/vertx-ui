import React from 'react'
import Ux from "ux";
import {ExTab} from 'ei';
import Ex from 'ex';
import PageModal from './model/UI';
import PageEntity from './entity/UI';
import PageRelation from './relation/UI';

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
                <PageEntity {...inherit}/>
                <PageModal {...inherit}/>
                <PageRelation {...inherit}/>
            </ExTab>
        ), Ex.parserOfColor("PxModeling").page())
    }
}

export default Component