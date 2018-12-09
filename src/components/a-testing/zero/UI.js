import React from 'react'
import Ux from 'ux';

import {Button, Form, Popover} from 'antd';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .form().raft(2)
    .to()
)
class Component extends React.PureComponent {
    render() {
        return (
            <Popover placement="topLeft"
                     title={"HELLO"}
                     content={
                         Ux.uiFieldForm(this, {}, 3)
                     }>
                <Button>表单测试</Button>
            </Popover>
        )
    }
}

export default Form.create()(Component)