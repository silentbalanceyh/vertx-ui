import React from 'react';
import Ux from "ux";
import Ex from 'ex';
import {Form} from "antd";

const jsx = {
    username: Ux.aiInput,
    password: Ux.aiInput
};

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .form().bind(Ex.Op)
    .to()
)
class Component extends React.PureComponent {
    render() {
        Ux.dgDebug(this.props, "[ ExLogin ]", "#696");
        return (
            <Form layout={"horizontal"}>
                {Ux.jsxFieldGrid(this, jsx, 1)}
            </Form>
        );
    }
}

export default Component;