import React from 'react'
import Ux from 'ux';
import Ex from 'ex';
import Op from './Op';
import renderJsx from "./Web.jsx";

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.init(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const form = Ux.fromHoc(this, "form");
            const {$inited = {}} = this.state;
            /*
             * 配置处理
             */
            const formAttrs = Ex.yoForm(this, {
                form,
            }, $inited);
            return renderJsx(this, {
                form: formAttrs,
                actions: Op.actions
            })
        });
    }
}

export default Component