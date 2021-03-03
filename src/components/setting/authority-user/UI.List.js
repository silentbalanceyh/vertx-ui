import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExListOpen} from "ei";
import Op from "./Op";

/*
 * modified by Hongwei
 * .ready(true) removed
 * componentDidMount added
 */
@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI.List")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const config = Ux.fromHoc(this, "grid");
        const form = {};
        return (
            <ExListOpen {...Ex.yoAmbient(this)}
                        $executor={Op.fnExecutor(this)}
                        $form={form}
                        config={config}/>
        );
    }
}

export default Component;
