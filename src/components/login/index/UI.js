import React from 'react'
import './Cab.less';
import Ux from 'ux';
import Op from './Op';
import {Form} from 'antd';

const {zero, Logger} = Ux;
const jsx = {
    username: Ux.aiInput,
    password: Ux.aiInput,
    $button: (reference, jsx = {}) => Ux.aiButtons(reference, jsx, Op, "fnLogin", "fnReset")
};

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .form().logger(Logger.form)
    .to()
)
class Component extends React.PureComponent {
    render() {
        return Ux.aiGrid([2, "span= 20, className=login-form", 2],
            Ux.Null,
            Ux.aiRows(["title", 'form', 'notice'],
                Ux.fromPath(this, "info", "title"),
                <Form layout={"horizontal"}>
                    {Ux.jsxFieldGrid(this, jsx, 1)}
                </Form>,
                [
                    Ux.aiHLink(this, "backend"),
                    Ux.aiHLink(this, "frontend")
                ]
            )
        )
    }
}

export default Component