import React from 'react';
import Ux from "ux";
import Ex from "ex";
import {ExForm} from "ei";
import {Fn} from 'app';

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Edit")
    .to()
)
class Component extends React.PureComponent {
    render() {
        /*
         * 配置处理
         */
        const {
            $inited = {
                data: [
                    "A",
                    "B"
                ]
            }
        } = this.props;
        const form = Ex.yoForm(this, null, $inited);
        return (
            <ExForm {...form} $height={"300px"}
                    $op={Fn.actions}/>
        );
    }
}

export default Component;