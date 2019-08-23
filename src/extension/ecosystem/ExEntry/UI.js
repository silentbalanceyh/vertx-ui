import React from 'react';
import Ux from "ux";
import Ex from 'ex';
import {Form} from "antd";
import Yo from './Op.Yo';

const jsx = {
    username: Ux.aiInput,
    password: Ux.aiInput,
};

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .form().bind(Ex.Op)
    .to()
)
class Component extends React.PureComponent {
    render() {
        Ux.dgDebug(this.props, "[ ExEntry ]", "#696");
        // 处理 button
        const form = Yo.yoForm(this);
        const button = Yo.yoButton(this);
        // 按钮专用
        return (
            <Form layout="horizontal">
                {form.map(item => (
                    <div className={"input-row"} key={item.field}>
                        {Ux.jsxFieldRow(this, item, jsx[item.field])}
                    </div>
                ))}
                {Ux.rtAnt(this, button)}
            </Form>
        );
    }
}

export default Component;