import React from 'react'
import Ux from "ux";
import Ex from 'ex';
import Op from './Op';
import {ExForm} from "ei";

const LOG = {
    name: "PxPassword",
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
        const header = Op.yoAlert(this);
        return Ex.ylCard(this, () => {
            /* 初始化状态专用，格式化form信息 */
            const user = Ux.isLogged();
            const inited = {};
            inited.key = user.key;
            inited.username = user.username;

            const form = Ex.yoForm(this, null, inited);
            return (
                <ExForm {...form} $height={"200px"}
                        $actions={Op.actions}/>
            );
        }, {
            ...LOG,
            header, // 头部警告信息
        });
    }
}

export default Component