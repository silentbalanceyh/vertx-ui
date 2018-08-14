import React from 'react';
import {Checkbox, Input} from 'antd';
import Immutable from 'immutable';

class Component extends React.PureComponent {

    triggerChange = (changedValue) => {
        // 必须提供
        const onChange = this.props.onChange;
        if (onChange) {
            const newValue = Object.assign({}, this.state, changedValue);
            // 计算相关值
            const {checkbox = [], input = {}} = this.props.config;
            const $checkedKeys = Immutable.fromJS(newValue.checked);
            const inputVal = newValue.input;
            // 最终取得的值处理
            const updated = checkbox.filter(checked => $checkedKeys.contains(checked.key));
            const value = inputVal[input.key];
            // 是否包含了输入值，对于值的处理
            if (value) {
                const item = {};
                item.key = input.key;
                item.label = value;
                updated.push(item);
            }
            onChange(updated);
        }
    };

    handleChecked = (event) => {
        const checked = Immutable.fromJS(event).toJS();
        this.setState({
            checked
        });
        this.triggerChange({checked})
    };

    handleInput = (event) => {
        const value = event.target.value || "";
        const {input = {}} = this.props.config;
        const changed = {};
        changed[input.key] = value;
        this.setState({
            input: changed
        });
        this.triggerChange({input: changed});
    };

    constructor(props) {
        super(props);
        const value = props.value || {};
        this.state = {
            checked: value.checked || [],
            input: value.input || ""
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState(value);
        }
    }

    render() {
        const {config = {}, ...rest} = this.props;
        const {checkbox = [], input = {}} = config;
        // 必须提取，将value取出来
        const {value = [], ...meta} = rest;
        // 计算其他
        let other = value.filter(item => item.key === "other").map(item => item.label)[0];
        if (!other) other = "";
        let checked = value.filter(item => item.key !== "other").map(item => item.key);
        return (
            <Input.Group compact>
                <Checkbox.Group {...meta} onChange={this.handleChecked} value={checked}>{checkbox.map(item => {
                    return (<Checkbox key={item.key}
                                      {...meta}
                                      value={item.value ? item.value : item.key}>
                        {item.label}
                    </Checkbox>)
                })}</Checkbox.Group>
                {input.label}：
                <Input name={input.key} style={{
                    width: "120px"
                }} {...meta} onChange={this.handleInput} value={other}/>
            </Input.Group>
        )
    }
}

export default Component