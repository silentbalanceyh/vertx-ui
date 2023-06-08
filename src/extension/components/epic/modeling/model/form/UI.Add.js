import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from 'ei';
import Op from './Op';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI.Add")
    .to()
)
class Component extends React.PureComponent {
    render() {
        /*
         * 配置处理
         */
        let $inited = {};
        // $inited.type = "MODEL";
        const form = Ex.yoForm(this, null, Ex.onApp($inited));
        return (
            <ExForm {...form} $height={"300px"}
                    $op={Op.actions}/>
        );
    }
}

export default Component;