import React from 'react'
import Ux from 'ux';
import Ex from 'ex';
import Op from './Op';
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
        Op.yiPage(this);
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
                <ExForm {...formAttrs} $height={"200px"}
                        $actions={Op.actions}/>
            )
        }, LOG);
    }
}

export default Component