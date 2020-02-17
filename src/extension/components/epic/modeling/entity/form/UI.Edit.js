import React from 'react';
import Ux from "ux";
import Ex from "ex";
import {ExForm} from "ei";
import Op from "./Op";

import FormField from './UI.Field';
import FormKey from './UI.Key';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI.Edit")
    .to()
)
class Component extends React.PureComponent {
    render() {
        /*
         * 配置处理
         */
        const {$inited = {}} = this.props;
        const form = Ex.yoForm(this, null, Ex.onApp($inited));
        return (
            <ExForm {...form} $height={"300px"}
                    $form={{
                        FormField,  // 字段编辑专用表单
                        FormKey,    // 键编辑专用表单
                    }}
                    $op={Op.actions}/>
        );
    }
}

export default Component;