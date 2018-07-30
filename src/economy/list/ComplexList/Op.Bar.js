import React from 'react'
import {Button, Col, Drawer, Input, Row} from 'antd';
import Init from './Op.Init';
import Ux from 'ux';
import Act from './Op.Action';

const _renderOp = (reference, key, value = "") => {
    if ("add" === key) {
        const button = {};
        button.icon = "plus";
        button.type = "primary";
        button.key = key;
        button.text = value;
        button.onClick = Act.rxAdd(reference);
        return button;
    }
};

const renderOp = (reference) => {
    const options = Init.readOption(reference);
    const ops = {};
    Ux.itObject(options, (field, value) => {
        if (field.startsWith("op")) {
            ops[field.substring(field.indexOf('.') + 1)] = value;
        }
    });
    const buttons = [];
    Ux.itObject(ops, (key, value) => {
        const addButton = _renderOp(reference, key, value);
        if (addButton) buttons.push(addButton);
    });
    return (
        <Button.Group>
            {buttons.map((button = {}) => {
                const {text, ...rest} = button;
                return (<Button {...rest}>{text}</Button>)
            })}
        </Button.Group>
    )
};

const renderSearch = (reference) => {
    const options = Init.readOption(reference);
    const {term} = reference.state;
    const enabled = options['search.enabled'];
    const advanced = options['search.advanced'];
    return enabled ? (
        (
            <Row>
                <Col span={advanced ? 18 : 24}>
                    <Input.Search placeholder={options['search.placeholder'] ?
                        options['search.placeholder'] : ""}
                                  onSearch={Act.rxFilter(reference)}
                                  value={term}
                                  onChange={Act.rxInput(reference)}/>
                </Col>
                {advanced ? (
                    <Col span={5} offset={1}>
                        <Button.Group>
                            <Button icon={"delete"} onClick={Act.rxClear(reference)}/>
                            <Button icon={"ellipsis"} onClick={() => {
                                reference.setState({drawer: true})
                            }}/>
                        </Button.Group>
                    </Col>
                ) : false}
            </Row>
        )
    ) : false
};

const renderDrawer = (reference) => {
    const options = Init.readOption(reference);
    const enabled = options['search.enabled'];
    const advanced = options['search.advanced'];
    if (enabled && advanced) {
        const {drawer = false} = reference.state;
        const config = {};
        config.placement = "right";
        config.maskClosable = false;
        config.visible = drawer;
        config.style = {
            height: 'calc(100% - 55px)',
            overflow: 'auto',
            paddingBottom: 53
        };
        config.width = options['search.advanced.width'];
        config.title = options['search.advanced.title'];
        config.onClose = () => {
            reference.setState({drawer: false})
        };
        const {$formFilter: Component} = reference.props;
        return Component ? (
            <Drawer {...config}>
                <Component {...reference.props}/>
            </Drawer>
        ) : false
    } else return false;
};

const renderButton = (reference, reset = false) => (event) => {
    event.preventDefault();
    const options = Init.readOption(reference);
    const {key, view} = reference.state;
    const prefix = reset ? options['submit.reset'] : options[`submit.${view}`];
    const connectId = `${prefix}${key ? key : ""}`;
    Ux.connectId(connectId);
};

const renderSubmit = (reference) => {
    const state = reference.state;
    const {view} = state;
    return "list" !== view ? (
        <Button.Group>
            <Button icon={"save"} onClick={renderButton(reference)}/>
            {"edit" === view ? (<Button icon={"delete"} type={"danger"}/>) : false}
            <Button icon={"reload"} onClick={renderButton(reference, true)}/>
        </Button.Group>
    ) : false
};
export default {
    renderOp,
    renderSearch,
    renderDrawer,
    renderSubmit
}