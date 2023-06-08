import React from 'react';
import {Button, Drawer, Dropdown} from 'antd';
import Dialog from '../Dialog/UI';
import __Zn from '../zero.uca.dependency';

const getChildren = (reference, item = {}) => {
    const {$component = {}} = reference.props;
    // 初始化数据专用
    const Component = $component[item.key]
    if (Component) {
        // 「LIMIT」限制继承
        const inherits =
            __Zn.yoChild(reference.props, __Zn.V_LIMIT.DialogMenu.Filter);
        // d?Submitting
        inherits.rxSubmitting = __Zn.rxSubmitting(reference);
        inherits.rxClose = (event) => {
            const data = __Zn.ambEvent(event);
            __Zn.of(reference).submitted().hide().handle(() => {

                // 上层
                const {rxClose} = reference.props;
                if (__Zn.isFunction(rxClose)) {
                    rxClose(data)
                }
            })
            // reference.?etState({$submitting: false, $visible: undefined});
            // // 上层
            // const {rxClose} = reference.props;
            // if (__Zn.isFunction(rxClose)) {
            //     rxClose(data)
            // }
        }
        return (
            <Component {...inherits}/>
        );
    } else {
        console.error("组件非法：", Component, item)
        return false;
    }
};
const renderWindow = (reference) => {
    const {$visible, $configMap = {}} = reference.state;
    if ($visible) {
        const config = $configMap[$visible];
        const dialog = __Zn.clone(config.dialog);
        // Mode
        const {mode, ...rest} = dialog;
        const jsx = getChildren(reference, config);
        if ("DRAWER" === mode) {
            return (
                (<Drawer key={config.key}
                         {...rest}
                         open>
                    {jsx}
                </Drawer>)
            );
        } else {
            const {$submitting = false} = reference.state;
            return (
                <Dialog key={config.key}
                        $loading={$submitting}
                        $dialog={dialog}
                        $visible>
                    {jsx}
                </Dialog>
            )
        }
    } else return false;
}
const renderMenu = (reference, item) => {
    const {children = [], button = {}} = item;
    const {onClick, text, ...rest} = button;
    const {$disabled = []} = reference.props;
    const attrMenu = {};
    attrMenu.onClick = onClick;
    const items = [];
    children.forEach(child => {
        const item = {};
        item.key = child.key;
        item.data = child;
        item.disabled = $disabled.includes(child.key);
        const {text, icon} = child.button;
        item.label = text;
        if (icon) {
            item.icon = __Zn.v4Icon(icon);
        }
        items.push(item);
    });
    attrMenu.items = items;
    return (
        <Dropdown key={item.key} disabled={rest.disabled}
                  menu={attrMenu}>
            <Button {...rest}>
                {text}
            </Button>
        </Dropdown>
    );
}
const renderButton = (reference, item = {}) => {
    const {text, confirm, ...rest} = item.button;
    return (
        <Button key={item.key} {...rest}>
            {text}
        </Button>
    )
}
export default {
    renderMenu,
    renderButton,
    renderWindow
};