import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from 'ei';
import Op from './Op';

@Ux.zero(Ux.rxEtat(require('../Cab'))
    .cab("UI.Add")
    .to()
)
class Component extends React.PureComponent {

    render() {
        /*
         * 配置处理
         */
        const {$router} = this.props;
        const params = $router.params();
        const form = Ex.yoForm(this, null, Ux.clone(params));
        return (
            <ExForm {...form} $height={"300px"}
                    $op={Op.actions}/>
        );
    }
}

export default Component;