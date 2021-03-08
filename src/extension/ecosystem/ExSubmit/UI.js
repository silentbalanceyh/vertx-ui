import React from 'react';
import Ux from "ux";
import Ex from 'ex';
import {Checkbox} from 'antd';

/**
 * ## 「组件」`ExSubmit`
 *
 * ```js
 * import { ExSubmit } from 'ei';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|Ok|x|
 *
 * @memberOf module:web-component
 * @method ExSubmit
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const state = {};
    state.$ready = true;
    const {$op = {}} = reference.props;
    state.$op = $op;
    reference.setState(state);
}
const jsx = {
    $button: (reference, jsx) => {
        const {config = {}} = jsx;
        const {rememberMe = "", forgotPassword = {}} = config;
        return (
            <div className={"login-action"}>
                <span className={"remember"}>
                    &nbsp;&nbsp;<Checkbox/>&nbsp;&nbsp;{rememberMe}
                </span>
                <span className={"forget"}>
                    &nbsp;&nbsp;
                    {/* eslint-disable-next-line */}
                    <a>{forgotPassword.text}</a>
                </span>
                <span className={"button"}>
                    {Ux.aiSubmit(reference, jsx)}
                </span>
            </div>
        )
    }
}

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("ExSubmit")
    .unmount()
    .form().raft(1).raft({
        ...Ex.Jsx.Login, ...jsx
    })
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this)
    }

    render() {
        return Ex.yoRender(this, () =>
                Ux.aiForm(this),
            Ex.parserOfColor("ExEntry").form())
    }
}

export default Component;