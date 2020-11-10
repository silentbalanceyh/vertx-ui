import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from 'ei';
import Op from './op/Op';

@Ux.zero(Ux.rxEtat(require('../Cab'))
    .cab("UI.Free.Edit")
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
                    $op={Op.Free.actions}/>
        );
    }
}

export default Component;