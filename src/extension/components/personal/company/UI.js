import React from 'react'
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from "ei";

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Ex.init(this).company();
    }

    render() {
        return Ex.ylCard(this, () => {
            const {$inited = {}} = this.state;
            /*
             * 配置处理
             */
            const formAttrs = Ex.yoForm(this, {}, $inited);
            return (
                <ExForm {...formAttrs} $height={"200px"}/>
            )
        }, Ex.parserOfColor("PxEnterprise").page());
    }
}

export default Component