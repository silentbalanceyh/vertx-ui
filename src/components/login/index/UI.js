import React from 'react'
import './Cab.less';
import Ux from 'ux';
import Op from './Op';
import {Form} from 'antd';
import Random from "../../../ux/Ux.Random";

const {zero} = Ux;
const jsx = {
    username: Ux.aiInput,
    password: Ux.aiInput,
    $button: (reference, jsx = {}) => Ux.aiButtons(reference, jsx, Op, "fnLogin", "fnReset")
};

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .form()
    .to()
)
class Component extends React.PureComponent {
    render() {
        const links = Ux.fromPath(this, "info", "links");
        console.info(links);
        return Ux.aiGrid([2, "span= 20, className=login-form", 2],
            Ux.Null,
            Ux.aiRows(["title", 'form', 'notice'],
                Ux.fromPath(this, "info", "title"),
                <Form layout={"horizontal"}>
                    {Ux.jsxFieldGrid(this, jsx, 1)}
                </Form>,
                links.map(link => (
                    <div key={Random.randomString(7)}>
                        {link.text}：
                        <a href={link.uri} target={"_blank"}>{link.uri}</a>
                    </div>
                ))
            )
        )
    }
}

export default Component