import React from 'react';
import Ux from 'ux';
import "./Cab.less";
import {DatePicker, Input, Radio} from 'antd';
import Immutable from 'immutable';

class Component extends React.PureComponent {
    triggerChange = (changedValue) => {
        const onChange = this.props.onChange;
        if (onChange) {
            const newValue = Object.assign({}, this.state, changedValue);
            onChange(Immutable.fromJS(newValue).toJS());
        }
    };
    handleDisabled = (event) => {
        const yes = event.target.value;
        const value = {};
        value.agree = "YES" === yes;
        if (!value.agree) {
            value.value = undefined;
        }
        this.setState(value);
        this.triggerChange(value);
    };

    handleDate = (event) => {
        const value = {};
        value.value = event;
        this.setState(value);
        this.triggerChange(value);
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
        const {config = [], related = {}, ...rest} = this.props;
        const {agree = false} = this.state;
        const disabled = related.disabled ? !agree : false;
        const {value, ...meta} = rest;
        let checkedValue = value && value.agree ? "YES" : "NO";
        let dateValue = value && value.value ? Ux.convertTime(value.value) : undefined;
        return (
            <Input.Group {...meta} compact>
                <Radio.Group className={"web-checked-radio"} onChange={
                    related.disabled ? this.handleDisabled : () => Ux.E.fxTerminal(true, 10017, "onChange")}
                             value={checkedValue}>
                    {config.map(item => (
                        <Radio key={item.key} value={item.value ? item.value : item.key}>
                            {item.label}</Radio>))}
                </Radio.Group>
                &nbsp;&nbsp;
                <span className={"web-checked-radio"}>
                {related.config && related.config.label ? `${related.config.label}：` : false}
                </span>
                <DatePicker {...related.config} onChange={this.handleDate}
                            disabled={disabled}
                            className={"rx-readonly"} value={dateValue}/>
            </Input.Group>
        );
    }
}

export default Component;