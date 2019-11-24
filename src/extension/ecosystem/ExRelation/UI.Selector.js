import React from 'react';
import Ux from "ux";
import Ex from "ex";
import {ExForm} from "ei";
import Op from './Op';
import FormCI from './UI.Ci';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("ExRelation")
    .to()
)
class Component extends React.PureComponent {
    render() {
        /*
         * 配置处理
         */
        const form = Ex.yoForm(this, null);
        return (
            <ExForm {...form} $height={"300px"}
                    $form={{
                        FormCI
                    }}
                    $op={Op.actions}/>
        );
    }
}

export default Component;