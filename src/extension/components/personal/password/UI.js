import React from 'react'
import Ux from "ux";
import Ex from 'ex';
import renderJsx from './Web.jsx'

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const alert = Ux.fromHoc(this, "alert");
        /* 初始化状态专用，格式化form信息 */
        const user = Ux.isLogged();
        const inited = {};
        inited.key = user.key;
        inited.username = user.username;

        const form = Ex.yoForm(this, null, inited);
        return renderJsx(this, {
            form,
            alert,
        })
    }
}

export default Component