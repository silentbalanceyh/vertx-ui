import React from 'react';
import {Input, TimePicker} from 'antd';
import Ux from 'ux';

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
        if (event) {
            values[name] = event.format(format);
            this.setState(values);
            this.triggerChange(values);
        }
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
        const fromValue = value ? Ux.convertTime(value.from, rest.format) : undefined;
        const toValue = value ? Ux.convertTime(value.to, rest.format) : undefined;
        return (
            <Input.Group {...rest}>
                <TimePicker {...rest} placeholder={placeholder[0]}
                            onChange={this.handleTime('from', rest.format)}
                            value={fromValue}/> -
                <TimePicker {...rest} placeholder={placeholder[1]}
                            onChange={this.handleTime('to', rest.format)}
                            value={toValue}/>
            </Input.Group>
        );
    }
}

export default Component;