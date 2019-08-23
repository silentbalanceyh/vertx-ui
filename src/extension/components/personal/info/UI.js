import React from 'react'
import Ux from 'ux';
import Ex from 'ex';
import Op from './Op';
import {ExForm} from "ei";

const LOG = {
    name: "PxInfo",
    color: "#5CACEE"
};

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .state({
        $ready: true,
    })
    .to()
)
class Component extends React.PureComponent {
    render() {
        return Ex.ylCard(this, () => {
            /*
             * 数据
             */
            const logged = Ux.isLogged();
            /*
             * 配置处理
             */
            const form = Ex.yoForm(this, null, Ux.clone(logged));
            return (
                <ExForm {...form} $height={"200px"}
                        $actions={Op.actions}/>
            )
        }, LOG)
    }
}

export default Component