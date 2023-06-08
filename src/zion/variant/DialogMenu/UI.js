import React from 'react';
import Op from './Op';
import {Button} from "antd";
import Rdr from './Web';
import __Zn from '../zero.uca.dependency';

// =====================================================
// componentInit/componentUp
// =====================================================
const parseDialog = (reference, item = {}) => {
    let config = __Zn.aiExprWindow(item.dialog);
    config = __Zn.clone(config);
    config.onCancel = (event) => {
        event.preventDefault();
        __Zn.of(reference).in({
            $visible: undefined
        }).done();
        // reference.?etState({$visible: undefined});
    };
    const id = config.onOk;
    if (!__Zn.isFunction(id)) {
        config.onOk = () => __Zn.connectId(id);
    }
    return config;
};
const parseDrawer = (reference, item) => {
    let config = __Zn.aiExprDrawer(item.dialog);
    config.onClose = (event) => {
        event.preventDefault();
        __Zn.of(reference).in({
            $visible: undefined
        }).done();
        // reference.?etState({$visible: undefined});
    };
    return config;
};
const parseItem = (item = {}, reference, configMap = {}) => {
    const itemConfig = {};
    // button
    const button = __Zn.aiExprAction(item.button);
    if (item.children) {
        // Children Loop
        const children = [];
        item.children.forEach(child => {
            const parsed = parseItem(child, reference, configMap);
            children.push(parsed);
        });
        itemConfig.children = children;
    }
    itemConfig.button = button;
    itemConfig.key = item.key ? item.key : item.component;
    if (item.component) {
        itemConfig.component = item.component;
    }
    // dialog
    if ("DRAWER" === item.mode) {
        const dialogConfig = parseDrawer(reference, item);
        dialogConfig.mode = "DRAWER";
        itemConfig.dialog = dialogConfig;
    } else {
        const dialogConfig = parseDialog(reference, item);
        if (item.executor) {
            itemConfig.executor = item.executor;
        } else {
            dialogConfig.mode = "DIALOG";
        }
        itemConfig.dialog = dialogConfig;
    }
    // Item Prepared
    if (item.children) {
        itemConfig.button.onClick = Op.rxMenu(reference, itemConfig);
    } else {
        itemConfig.button.onClick = Op.rxClick(reference, itemConfig);
    }
    configMap[itemConfig.key] = itemConfig;
    return itemConfig;
}
const componentInit = (reference) => {
    const {config = []} = reference.props;
    const normalized = [];
    const configMap = {};
    config.forEach(each => {
        const parsed = parseItem(each, reference, configMap);
        if (parsed) {
            normalized.push(parsed)
        }
    });
    const state = {};
    state.$config = normalized;
    state.$configMap = configMap;
    // state.$ready = true;
    __Zn.of(reference).in(state).ready().done();
    // reference.?etState(state);
    // state.$ready = true;
};

class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return __Zn.xtRender(this, () => {
            const {$config = {}} = this.state;
            const {$disabled = []} = this.props;
            return (
                <Button.Group>
                    {$config.map(item => {
                        const $item = __Zn.clone(item);
                        if ($disabled.includes(item.key)) {
                            $item.button.disabled = true;
                        }
                        if ($item.children) {
                            return Rdr.renderMenu(this, $item);
                        } else {
                            return Rdr.renderButton(this, $item);
                        }
                    })}
                    {Rdr.renderWindow(this)}
                </Button.Group>
            );
        });
    }
}

export default Component;