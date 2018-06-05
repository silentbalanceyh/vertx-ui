import React from 'react';
import {Input} from 'antd';
import moment from 'moment';

class Component extends React.PureComponent {
    triggerChange = (changedValue) => {
        // 必须提供
        const onChange = this.props.onChange;
        if (onChange) {
            const newValue = Object.assign({}, this.state, changedValue);
            const targetValue = {};
            // 计算时间
            if (newValue.version) targetValue.version = newValue.version;
            targetValue.source = {
                year: newValue.year,
                month: newValue.month,
                day: newValue.day
            };
            if (newValue.year && newValue.month && newValue.day) {
                targetValue.date = moment([newValue.year, newValue.month, newValue.day]);
            }
            onChange(targetValue);
        }
    };
    handleInput = (name) => (event) => {
        if (name) {
            const value = event.target.value || "";
            const changed = {};
            changed[name] = value;
            this.setState(changed);
            this.triggerChange(changed);
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
        const {config = {}, ...rest} = this.props;
        const {value, ...meta} = rest;
        return (
            <Input.Group compact {...meta}>
                <Input addonAfter={config.year} style={{width: config.width ? config.width : 100}} {...meta}
                       onChange={this.handleInput('year')}/>
                <Input addonAfter={config.month} style={{width: config.width ? config.width : 100}} {...meta}
                       onChange={this.handleInput('month')}/>
                <Input addonAfter={config.day} style={{width: config.width ? config.width : 100}} {...meta}
                       onChange={this.handleInput('day')}/>
                {config.version ? <Input addonAfter={config.version}
                                         style={{width: config.width ? config.width : 100}} {...meta}
                                         onChange={this.handleInput('version')}
                /> : false}
            </Input.Group>
        )
    }
}

export default Component