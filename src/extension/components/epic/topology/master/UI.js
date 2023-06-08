import React from 'react';
import Op from './op';
import Ex from 'ex';
import {ExGraphicEditor} from 'ei';
import Ux from "ux";

@Ux.zero(Ux.rxEtat(require('../Cab.json'))
    .cab("UI.Master")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiGraphic(this)
    }

    render() {
        return Ex.yoRender(this, () => {
            const inherit = Ex.yoAmbient(this);

            inherit.config = Ux.fromHoc(this, 'graphic');

            const gxFun = Op.rxCommand(this);
            return (
                <ExGraphicEditor {...inherit} {...gxFun}/>
            );
        }, Ex.parserOfColor("PxTopologyMaster").page())
    }
}

export default Component;