import Ux from "ux";
import Fx from "../Fx";
import Op from "./Op";
import React from "react";

export default (reference, item = {}) => {
    const {FormEdit: Component} = reference.props;
    // 添加的时候activeKey就应该只有一个，就是item.key
    // 「LIMIT」限制继承
    const limitation = Ux.toLimitation(reference.props, Fx.Limit.Form.Edit);
    const inherit = Op.inFormEdit(reference, item);
    return Component ? (
        <Component {...limitation}
                   {...inherit}/>
    ) : false;
};