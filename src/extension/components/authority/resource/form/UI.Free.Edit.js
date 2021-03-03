import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from 'ei';
import Op from './op/Op';
import Rdr from "./Web.Render";

@Ux.zero(Ux.rxEtat(require('../Cab'))
    .cab("UI.Free.Edit")
    .to()
)
class Component extends React.PureComponent {
    render() {
        /*
         * 配置处理
         */
        const {$inited = {}} = this.props;
        /*
         * 计算 modelKey / resourceType
         */
        const initial = Ux.clone($inited);
        const source = Ux.onDatum(this, "resource.models");
        const model = Ux.elementUnique(source, "identifier", $inited.identifier);
        if (model) {
            initial.modelKey = model.key;
            const branch = Ux.elementBranch(source, model.key, "parentId");
            const resource = Ux.elementUnique(branch, 'parentId', undefined);
            if (resource) {
                initial.resourceType = resource.code;
            }
        }
        const form = Ex.yoForm(this, null, initial);
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