import React from 'react'
import Ux from 'ux'
import {Form, InputNumber, Slider} from 'antd';

class Component extends React.PureComponent {

    render() {
        const {reference, $window = 100} = this.props;
        return Ux.aiGrid([20, 4],
            <Slider min={0} max={100} defaultValue={100} value={$window}
                    onChange={event => reference.setState({window: event})}/>,
            <Form layout={"inline"}>
                <Form.Item label={"window = "} labelCol={{
                    span: 12
                }} wrapperCol={{
                    span: 12
                }}>
                    <InputNumber value={$window} min={0} max={100}
                                 onChange={event => reference.setState({window: event})}/>
                </Form.Item>
            </Form>
        )
    }
}

export default Component;