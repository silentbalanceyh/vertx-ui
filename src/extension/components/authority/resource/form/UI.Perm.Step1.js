import React from 'react';
import Ux from 'ux';
import Ex from "ex";
import {ExForm} from 'ei';
import Op from './op/Op';
import Rdr from "./Web.Render";

@Ux.zero(Ux.rxEtat(require("../Cab.json"))
    .cab("UI.Perm.Step1")
    .to()
)
class Component extends React.PureComponent {

    render() {
        const {$inited = {}, $permissions = []} = this.props;
        const form = Ex.yoForm(this, null, $inited);
        return (
            <ExForm {...form} $op={Op.Perm.actions}
                    $permissions={$permissions}
                    $renders={{
                        // 子表单字段专用处理
                        __children: {
                            permissions: {
                                modelKey: Rdr.modelKey,
                                sourcePermission: Rdr.sourcePermission
                            }
                        }
                    }}/>
        )
    }
}

export default Component;