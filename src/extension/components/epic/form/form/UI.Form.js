import React from 'react';
import Ux from "ux";
import Ex from "ex";
import {ExForm} from "ei";
import Op from "./Op";

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
                            const $jsx = Ux.clone(jsx);
                            $jsx.addonBefore = `form.${$inited.identifier}.`;
                            if ($inited.key) {
                                $jsx.readOnly = true;
                            }
                            return Ux.aiInput(reference, $jsx);
                        }
                    }}
                    $op={Op.actions}/>
        );
    }
}

export default Component;