import React from 'react';
import Ux from "ux";
import Ex from 'ex';
import {Button, Checkbox} from 'antd';

const jsx = {
    $button: (reference, jsx) => {
        const {config = {}, buttons = {}} = jsx;
        const {rememberMe = "", forgotPassword = {}} = config;
        const button = Ux.aiExprOp(buttons.submit);
        return (
            <div className={"login-action"}>
                <span className={"remember"}>
                    &nbsp;&nbsp;<Checkbox/>&nbsp;&nbsp;{rememberMe}
                </span>
                <span className={"forget"}>
                    &nbsp;&nbsp;
                    <a>{forgotPassword.text}</a>
                </span>
                <span className={"button"}>
                    <Button onClick={event => {
                        /*
                         * 关联引擎中的核心Button
                         */
                    }}>
                        {button.text}
                    </Button>
                </span>
            </div>
        )
    }
}

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("ExLogin1")
    .form().raft(1).raft({
        ...Ex.Jsx.Login, ...jsx
    })
    .bind(Ex.Op)
    .to()
)
class Component extends React.PureComponent {
    render() {
        return Ex.yoRender(this, () =>
                Ux.aiForm(this),
            Ex.parserOfColor("ExEntry").form())
    }
}

export default Component;