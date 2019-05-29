import Ux from "ux";
import React from 'react';
import Fx from '../Fx';
import Op from './Op';

export default (reference, item = {}) => {
    const {FormAdd: Component} = reference.props;
    // 添加的时候activeKey就应该只有一个，就是item.key
    // 「LIMIT」限制继承
    const limitation = Ux.toLimitation(reference.props, Fx.Limit.Form.Add);
    const inherit = Op.inFormAdd(reference, item);
    Ux.dgDebug(inherit, "[Ex] 添加表单");
    return Component ? (
        <Component {...limitation}
                   {...inherit}/>
    ) : false;
};