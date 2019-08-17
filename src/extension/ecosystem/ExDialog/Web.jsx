import React from 'react';
import ExButton from '../ExButton/UI';

import renderWindow from './Web.Window';
import renderPopover from './Web.Popover';

import Ux from "ux";
import Ex from "ex";

const _jsxChildren = (reference, component = {}, attributes = {}) => {
    const {config = {}, Component} = component;
    if (Component) {
        const inherit = Ux.clone(attributes);
        inherit.rxClose = Ex.rsVisible(reference, false);
        return (
            <Component {...inherit} config={config}/>
        );
    } else {
        console.error("未捕捉到组件！", component);
        return false;
    }
};

const _jsxDialog = (reference, dialog = {}, attributes = {}) => {
    const {config = {}, component = {}} = dialog;
    const {type = "WINDOW", ...rest} = config;
    let fnRender = null;
    if ("WINDOW" === type) {
        fnRender = renderWindow;
    } else {
        fnRender = renderPopover;
    }
    return fnRender(reference, () =>
        _jsxChildren(reference, component, attributes), rest);
};
export default (reference, {
    button = {},
    dialog = {},
    attributes = {},
}) => {
    return (
        <span>
            {_jsxDialog(reference, dialog, attributes)}
            <ExButton {...attributes} config={button}/>
        </span>
    );
}