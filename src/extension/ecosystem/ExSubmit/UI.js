import React from 'react';
import Ux from "ux";
import Ex from 'ex';
import {Checkbox} from 'antd';
import Op from './Op';

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
        Op.yiComponent(this)
    }

    render() {
        return Ex.yoRender(this, () =>
                Ux.aiForm(this),
            Ex.parserOfColor("ExEntry").form())
    }
}

export default Component;