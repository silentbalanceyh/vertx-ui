import Ux from "ux";
import React from 'react';
import Fx from '../Fx';

export default (reference, item = {}) => {
    const {FormAdd: Component} = reference.props;
    // 添加的时候activeKey就应该只有一个，就是item.key
    // 「LIMIT」限制继承
    const inherits = Ux.toLimitation(reference.props, Fx.Limit.Form.Add);
    return Component ? (
        <Component
            /* 模拟数据 */
            fnMock={Fx.Mock.mockRecord(reference)}
            $addKey={item.key}
            {...inherits}/>
    ) : false;
};