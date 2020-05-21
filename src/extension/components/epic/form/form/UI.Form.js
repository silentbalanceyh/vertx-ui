import React from 'react';
import Ux from "ux";
import Ex from "ex";
import {ExForm} from "ei";
import Op from "./Op";
import UiCode from './UI.Form.Code';

@Ux.zero(Ux.rxEtat(require('../Cab'))
    .cab("UI.Form")
    .to()
)
class Component extends React.PureComponent {
    render() {
        /*
         * 配置处理
         */
        const {$inited = {}} = this.props;
        const form = Ex.yoForm(this, null, $inited);
        return (
            <ExForm {...form} $height={"300px"}
                    $renders={{
                        code: (reference, jsx) => {
                            return (<UiCode reference={reference} {...jsx}/>)
                        }
                    }}
                    $op={Op.actions}/>
        );
    }
}

export default Component;