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
        const {$query = {}} = this.props;
        /*
         * 特殊解析，提取 type 参数
         */
        const criteria = $query.criteria;
        const $inited = {};
        if (criteria['type,=']) {
            $inited.type = criteria['type,='];
        }
        const form = Ex.yoForm(this, null, $inited);
        return (
            <ExForm {...form} $height={"300px"}
                    $actions={Op.actions}/>
        );
    }
}

export default Component;