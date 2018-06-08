import React from 'react'
import {Input, TimePicker} from 'antd';

class Component extends React.PureComponent {
    triggerChange = (changedValue) => {
        const onChange = this.props.onChange;
        if (onChange) {
            const newValue = Object.assign({}, this.state, changedValue);
            onChange(newValue);
        }
    };

    handleTime = (name, format = "HH:mm:ss") => (event) => {
        const values = {};
        values[name] = event.format(format);
        this.setState(values);
        this.triggerChange(values);
    };

    constructor(props) {
        super(props);
        this.state = props.value || {};
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState(value);
        }
    }

    render() {
        const {value, placeholder = [], ...rest} = this.props;
        return (
            <Input.Group {...rest}>
                <TimePicker {...rest} placeholder={placeholder[0]}
                            onChange={this.handleTime('from', rest.format)}/> -
                <TimePicker {...rest} placeholder={placeholder[1]}
                            onChange={this.handleTime('to', rest.format)}/>
            </Input.Group>
        )
    }
}

export default Component;