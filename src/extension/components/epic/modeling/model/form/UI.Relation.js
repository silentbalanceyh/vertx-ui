import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from 'ei';
import Op from './Op';
import Trigger from "./Trigger";

const Jsx = {
    entity: Ux.ai2Select(Trigger.source),
};

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI.Relation")
    .to()
)
class Component extends React.PureComponent {
    render() {
        /*
         * 配置处理
         */
        const {$inited = {}, $mode, reference} = this.props;
        let initials = {};
        initials.key = $inited.key;
        initials.model = $inited.model;
        initials.namespace = $inited.namespace;
        if (Ux.Env.FORM_MODE.ADD === $mode) {
            /*
             * 默认值
             */
            const ref = Ux.onReference(reference, 1);
            initials.model = Ux.formHit(ref, "identifier");
            initials.namespace = Ux.formHit(ref, "namespace");
        } else {
            /*
             * 更新表单专用值
             */
            const entity = Ux.elementUniqueDatum(this, "resource.entities","identifier",  $inited.entity);
            initials.entityId = entity.key;
            Object.assign(initials, $inited);
        }
        const form = Ex.yoForm(this, null, initials);
        return (
            <ExForm {...form} $height={"300px"}
                    $mode={$mode}
                    $jsx={Jsx}
                    $op={Op.actions}/>
        );
    }
}

export default Component;