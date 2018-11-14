import React from 'react'
import {Button, Checkbox, Form, Popover} from 'antd';

class Component extends React.PureComponent {
    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Popover placement="topLeft"
                     title={"HELLO"}
                     content={
                         <form>
                             <Form.Item>
                                 {getFieldDecorator("active", {
                                     valuePropName: 'checked',
                                     validateTrigger: 'onBlur',
                                     initialValue: true
                                 })(
                                     <Checkbox/>
                                 )}
                             </Form.Item>
                         </form>
                     }>
                <Button>表单测试</Button>
            </Popover>
        )
    }
}

export default Form.create()(Component)