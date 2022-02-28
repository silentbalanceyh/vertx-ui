import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from 'ei';
import Op from './op/Op';
import Rdr from "./Web.Render";

@Ux.zero(Ux.rxEtat(require('../Cab'))
    .cab("UI.Free.Add")
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
                    $op={Op.Free.actions}
                    $renders={{
                        modelKey: Rdr.modelKey,
                        sourcePermission: Rdr.sourcePermission,
                    }}/>
        );
    }
}

export default Component;