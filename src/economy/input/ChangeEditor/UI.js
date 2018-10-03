import React from 'react';
import './Cab.less';
import {Col, Input, Row} from 'antd';
import Immutable from "immutable";

class Component extends React.PureComponent {
    triggerChange = (changedValue) => {
        const onChange = this.props.onChange;
        if (onChange) {
            const newValue = Object.assign({}, this.state, changedValue);
            onChange(Immutable.fromJS(newValue).toJS());
        }
    };
    handleInput = (key) => (event) => {
        const text = event.target.value;
        if (text && key) {
            const value = {};
            value[key] = text;
            this.setState(value);
            this.triggerChange(value);
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
        const {config = {}, source = [], ...jsx} = this.props;
        const {value, ...meta} = jsx;
        const {from = {}, to = {}} = config;
        const fromTitle = from.title ? from.title : "";
        const toTitle = to.title ? to.title : "";
        return (
            <Input.Group {...meta}>
                <Row className={"web-changeeditor-head"}>
                    <Col span={4}/>
                    <Col span={7}>{fromTitle}</Col>
                    <Col span={3}/>
                    <Col span={7}>{toTitle}</Col>
                </Row>
                {source.map(item => {
                    return (
                        <Row key={`row${item.key}`} className={"web-changeeditor-row"}>
                            <Col span={4}>{item.label}：</Col>
                            <Col span={7}>
                                <Input {...meta} readOnly {...from}/>
                            </Col>
                            <Col span={3}/>
                            <Col span={7}>
                                <Input {...meta} {...to}
                                       onChange={this.handleInput(item.key)}/>
                            </Col>
                        </Row>
                    );
                })}
            </Input.Group>
        );
    }
}

export default Component;