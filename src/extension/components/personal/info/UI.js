import React from 'react'
import Ux from 'ux';
import Ex from 'ex';
import Op from './Op';
import renderJsx from './Web.jsx';

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        /*
         * 数据
         */
        const logged = Ux.isLogged();
        /*
         * 配置处理
         */
        const form = Ex.yoForm(this, null, Ux.clone(logged));
        return renderJsx(this, {
            form,
            actions: Op.actions
        })
    }
}

export default Component