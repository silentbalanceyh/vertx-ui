import React from 'react'
import {Button, Col, Drawer, Input, Row} from 'antd';
import Init from './Op.Init';
import Ux from 'ux';
import Act from './Op.Action';
import Immutable from 'immutable';

const _renderAdd = (reference, key, value = "") => {
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
    const config = Init.initConfig(reference);
    const op = config.op ? config.op : {};
    const buttons = [];
    Ux.itObject(op, (key, value) => {
        const addButton = _renderAdd(reference, key, value);
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
    const config = Init.initConfig(reference);
    const op = config.op;
    return op.search ? (
        (
            <Row>
                <Col span={op.search['more'] ? 19 : 24}>
                    <Input.Search placeholder={op.search['placeholder'] ? op.search['placeholder'] : ""}/>
                </Col>
                {op.search['more'] ? (
                    <Col span={4} offset={1}>
                        <Button.Group>
                            <Button icon={"ellipsis"} onClick={Act.activeDrawer(reference)}/>
                        </Button.Group>
                    </Col>
                ) : false}
            </Row>
        )
    ) : false
};

const renderDrawer = (reference) => {
    const config = Init.initConfig(reference);
    const op = config.op;
    if (op.search && op.search['more']) {
        const {drawer = false} = reference.state;
        const drawerConfig = Immutable.fromJS(config.drawer).toJS();
        drawerConfig.placement = "right";
        drawerConfig.maskClosable = false;
        drawerConfig.visible = drawer;
        drawerConfig.style = {
            height: 'calc(100% - 55px)',
            overflow: 'auto',
            paddingBottom: 53
        };
        drawerConfig.onClose = Act.closeDrawer(reference);
        const {$formFilter: Component} = reference.props;
        return Component ? (
            <Drawer {...drawerConfig}>
                <Component {...reference.props}/>
            </Drawer>
        ) : false
    } else return false;
};

const renderButton = (reference, reset = false) => (event) => {
    event.preventDefault();
    const config = Init.initConfig(reference);
    const {submit} = config.op;
    const {key, view} = reference.state;
    const prefix = reset ? submit["reset"] : submit[view];
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