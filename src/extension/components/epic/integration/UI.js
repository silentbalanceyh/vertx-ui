import React from 'react'
import Ux from "ux";
import Ex from "ex";
import {ExTab} from "ei";
import PageApi from "./UI.Api";
import PageService from "./UI.Service";

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
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
                <PageApi {...inherit}/>
                <PageService {...inherit}/>
            </ExTab>
        ))
    }
}

export default Component