import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExForm, ExService} from 'ei';
import Op from './Op';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI.Form")
    .ready(true)
    .to()
)
class Component extends React.PureComponent {
    render() {
        return Ex.yoRender(this, () => {
            /*
             * 读取 $inited
             */
            const {$inited = {}} = this.props;
            const form = Ex.yoForm(this, {}, $inited);
            const $form = {
                ExService
            };
            return (
                <ExForm {...form} $height={"300px"}
                        $op={Op.actions}
                        $form={$form}/>
            );
        }, Ex.parserOfColor("PxJobForm").page())
    }
}

export default Component;