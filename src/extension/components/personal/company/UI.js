import React from 'react'
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from "ei";

const LOG = {
    name: "PxCompany",
    color: "#5CACEE"
};

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
            const form = Ux.fromHoc(this, "form");
            const {$inited = {}} = this.state;
            /*
             * 配置处理
             */
            const formAttrs = Ex.yoForm(this, {
                form,
            }, $inited);
            return (
                <ExForm {...formAttrs} $height={"200px"}/>
            )
        }, LOG);
    }
}

export default Component