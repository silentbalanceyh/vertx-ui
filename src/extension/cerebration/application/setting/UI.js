import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from "ei";
import Op from './Op'

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .ready(true)
    .to()
)
class Component extends React.PureComponent {
    render() {
        return Ex.ylCard(this, () => {
            // 从 Localhost中提取数据
            const inited = Ux.isInit();
            const form = Ex.yoForm(this, null, inited);
            return (
                <ExForm {...form} $op={Op.actions}/>
            )
        }, Ex.parserOfColor("Application.Setting").toolkit())
    }
}

export default Component