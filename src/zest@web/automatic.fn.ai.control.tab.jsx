import {Button, Drawer, Tabs, Tooltip} from "antd";
import React from "react";
import __Zn from './zero.module.dependency';
import __V4 from './aureole.fn.ai.child.v4.patch';

const aiTabPage = (reference, children = {}) => {
    const {$tabs = {}} = reference.state ?
        reference.state : {};
    const {items = [], ...rest} = $tabs;
    // v4
    const $items = __V4.v4Items(items, {
        // itemFn 默认
        childFn: (item) => {
            const fnRender = children[item.key];
            return __Zn.isFunction(fnRender) ? fnRender(item) :
                `对不起，children 函数丢失：${item.key}`
        }
    }, reference);
    /*
            {items.map(item => {
                const fnRender = children[item.key];
                return (
                    <Tabs.?abPane {...item}>
                        {__Zn.isFunction(fnRender) ? fnRender(item) :
                            `对不起，children 函数丢失：${item.key}`}
                    </Tabs.?abPane>
                )
            })}
     */
    return (
        <Tabs {...rest} items={$items}/>
    )
}

const __rxSwitch = (reference, item = {}, open = true) => (event) => {
    __Zn.prevent(event);
    const $vKey = `$${item.key}`;
    const state = {};
    state[$vKey] = open;
    if (!open) {
        const $vKeyT = `${$vKey}_tip`;
        state[$vKeyT] = false;
    }
    __Zn.of(reference).in(state).done();
}
const __aiTabExtraContent = (reference, configuration = {}) => {
    const {item = {}, data, config} = configuration;
    const {type} = item;
    if (!type) {
        return false;
    }
    const FN_WIN = {
        "drawer": __Zn.aiExprDrawer,
        "window": __Zn.aiExprWindow,
        "popover": __Zn.aiExprPopover,
    }
    const fnWin = FN_WIN[type];
    if (!__Zn.isFunction(fnWin)) {
        return false;
    }
    const {window, componentFn} = item;
    const {$renders = {}} = reference.props;
    const winConfig = fnWin(window);
    const vKey = `$${item.key}`;
    winConfig.open = reference.state ? reference.state[vKey] : false;
    winConfig.onClose = __rxSwitch(reference, item, false);
    const componentJsx = $renders[componentFn];
    if ("drawer" === type) {
        const className = config.className ? config.className : "";
        return (
            <Drawer {...winConfig} className={className}>
                {__Zn.isFunction(componentJsx) ? componentJsx(data, config, reference) : false}
            </Drawer>
        )
    } else {
        console.warn("后期拓展");
        return false;
    }
}
const __aiTabExtraItem = (reference, configuration = {}) => {
    const {item = {}} = configuration;
    const {button = {}} = item;
    const {
        tooltip = "",
        text,
        icon,
    } = button;
    const $icon = __Zn.v4Icon(icon);
    if (tooltip) {
        const vKey = `$${item.key}`;
        const open = reference.state ? reference.state[vKey] : false;

        const vKeyT = `$${item.key}_tip`;
        const openT = reference.state ? reference.state[vKeyT] : false;
        return (
            <Tooltip key={item.key} title={tooltip}
                     open={!open && openT} onOpenChange={(opened) => {
                const state = {};
                state[vKeyT] = opened;
                __Zn.of(reference).in(state).done();
            }}>
                <Button icon={$icon} onClick={__rxSwitch(reference, item, true)}/>
                {__aiTabExtraContent(reference, configuration)}
            </Tooltip>
        )
    } else {
        if (!text) {
            return false;
        }
        return (
            <Button key={item.key} icon={$icon}
                    onClick={__rxSwitch(reference, item, true)}>
                {text}
                {__aiTabExtraContent(reference, configuration)}
            </Button>
        )
    }
}
const aiTabExtra = (reference, config = {}) => {
    const {
        items = [],
        ...rest
    } = config;
    if (1 < items.length) {
        return (
            <Button.Group>
                {items.map(item => __aiTabExtraItem(reference, {...rest, item}))}
            </Button.Group>
        )
    } else {
        const item = items[0];
        if (item) {
            return __aiTabExtraItem(reference, {...rest, item})
        } else return false;
    }
}
export default {
    aiTabPage,
    aiTabExtra,
}