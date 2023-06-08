import React from 'react';
import Ux from "ux";
import Ex from "ex";
import {ExForm} from "ei";
import Op from "./Op";

@Ux.zero(Ux.rxEtat(require('../Cab'))
    .cab("UI.Edit")
    .to()
)
class Component extends React.PureComponent {
    render() {
        /*
         * 配置处理
         */
        const {$inited = {}} = this.props;
        const {$router} = this.props;
        const params = $router.params();
        $inited.type = params.type;     // 只设置 type
        const form = Ex.yoForm(this, null, $inited);
        return (
            <ExForm {...form} $height={"300px"}
                    $op={Op.actions}/>
        );
    }
}

export default Component;