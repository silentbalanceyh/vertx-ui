import React from 'react'
import './Cab.less';
import Ux from 'ux';
import {Form} from 'antd';
import Op from './Op';

const {zero} = Ux;
const jsx = {
    username: Ux.aiInput,
    password: Ux.aiInput
};

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .form().raft(jsx).bind(Op)
    .to()
)
class Component extends React.PureComponent {
    render() {
        const links = Ux.fromPath(this, "info", "links");
        return Ux.aiGrid([2, "span= 20, className=login-form", 2],
            Ux.Null,
            Ux.aiRows(["title", 'form', 'notice'],
                Ux.fromPath(this, "info", "title"),
                <Form layout={"horizontal"}>
                    {Ux.jsxFieldGrid(this, jsx, 1)}
                </Form>,
                links.map(link => (
                    <div key={Ux.randomString(7)}>
                        {link.text}：
                        <a href={link.uri} target={"_blank"}>{link.uri}</a>
                    </div>
                ))
            )
        )
    }
}

export default Component