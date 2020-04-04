import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from 'ei';
import Op from './Op';
import {LoadingAlert} from 'web';

@Ux.zero(Ux.rxEtat(require('../Cab'))
    .cab("UI.Add")
    .to()
)
class Component extends React.PureComponent {
    render() {
        /*
         * 配置处理
         */
        const form = Ex.yoForm(this, null);
        const alert = Ux.fromHoc(this, "alert");
        return (
            <div>
                <LoadingAlert $alert={alert}/>
                <ExForm {...form} $height={"300px"}
                        $op={Op.actions}/>
            </div>
        );
    }
}

export default Component;