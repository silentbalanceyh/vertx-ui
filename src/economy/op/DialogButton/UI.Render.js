import React from 'react'
import {DynamicDialog} from "web";

const getChildren = (reference) => {
    const {children, $content: Component} = reference.props;
    // 优先取children
    if (children) return children;
    // 其次取$content，必须执行Jsx的转换
    if (Component) {
        return (
            <Component/>
        )
    }
    return false;
};

const renderDialog = (reference) => {
    const jsx = getChildren(reference);
    const {visible = false, dialog = {}} = reference.state;
    return (
        <DynamicDialog $dialog={dialog} $visible={visible}>
            {jsx}
        </DynamicDialog>
    );
};
const renderDrawer = (reference) => {
    const jsx = getChildren(reference);
    return false;

};
const renderPopover = (reference) => {
    const jsx = getChildren(reference);
    return false;

};
export default {
    DIALOG: renderDialog,
    DRAWER: renderDrawer,
    POPOVER: renderPopover
}