import React from 'react';
import Ux from "ux";
import Ex from 'ex';

/**
 * ## 「组件」`ExLogin`
 *
 * ```js
 * import { ExLogin } from 'ei';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|x|x|
 *
 * @memberOf module:uca/extension
 * @method ExLogin
 **/
const UCA_NAME = "ExLogin";

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab(UCA_NAME)
    .form().raft(1).raft(Ex.Jsx.Login)
    .bind(Ex.Op)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;

    render() {
        return Ex.yoRender(this, () =>
                Ux.aiForm(this),
            Ex.parserOfColor(UCA_NAME).form())
    }
}

export default Component;