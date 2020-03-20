import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from 'ei';
import Op from './Op';

@Ux.zero(Ux.rxEtat(require('../Cab'))
    .cab("UI.Form.Add")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const {
            $inited = {},
            rxEdgeAdd, // 特殊函数
        } = this.props;
        const form = Ex.yoForm(this, null, $inited);
        return (
            <ExForm {...form} $height={"300px"}
                    rxEdgeAdd={rxEdgeAdd}
                    $op={Op.actions}/>
        );
    }
}

export default Component;