import U from "underscore";
import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from 'ei';
import Op from './Op';
import Trigger from "./Trigger";


const Jsx = {
    source: Ux.ai2Select(Trigger.source),
};

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI.Attribute")
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
        initials.modelId = $inited.parentId;

        // 将外层form所选择好的entity列表化放在form上作为实体下拉的options
        const ref = Ux.onReference(reference, 1);
        const entities = Ux.formHit(ref, "joins");
        if (entities && U.isArray(entities)) {
            initials.selectedEntityIds = entities.map(item => item.entity);
        }

        if (Ux.Env.FORM_MODE.ADD === $mode) {
            /*
             * 默认值
             */
            initials.active = true;
            const ref = Ux.onReference(reference, 1);
            initials.modelId = Ux.formHit(ref, "key");
        } else {
            /*
             * 更新表单专用值
             */
            // 将本层form所选择好的entity的ID放在form上作为属性下拉cascade的依据
            const entity = Ux.elementUniqueDatum(this, "resource.entities", "identifier", $inited.source);
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