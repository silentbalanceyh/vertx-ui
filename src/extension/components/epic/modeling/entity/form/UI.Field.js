import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from 'ei';
import Op from './Op';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI.Field")
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
        initials.entityId = $inited.parentId;
        initials.clientFormMode = $mode;
        if (Ux.Env.FORM_MODE.ADD === $mode) {
            /*
             * 默认值
             */
            initials.type = "java.lang.String";
            initials.active = true;
            initials.primary = false;
            initials.nullable = true;
            const ref = Ux.onReference(reference, 1);
            initials.entityId = Ux.formHit(ref, "key");
        } else {
            /*
             * 更新表单专用值
             */
            Object.assign(initials, $inited);
        }
        const form = Ex.yoForm(this, null, initials);
        return (
            <ExForm {...form} $height={"300px"}
                    $mode={$mode}
                    $op={Op.actions}/>
        );
    }
}

export default Component;