import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from 'ei';
import Op from './Op';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI.Key")
    .to()
)
class Component extends React.PureComponent {
    render() {
        /*
         * 配置处理
         */
        const {$inited = {}, $mode} = this.props;
        let initials = {};
        initials.key = $inited.key;
        initials.entityId = $inited.parentId;
        if (Ux.Env.FORM_MODE.ADD === $mode) {
            /*
             * 默认值
             */
            initials.active = true;
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