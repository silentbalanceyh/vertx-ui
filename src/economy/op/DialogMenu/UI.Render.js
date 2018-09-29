import React from 'react'
import {Icon} from 'antd'
import DynamicDialog from '../../dialog/DynamicDialog/UI';

const _renderPure = (button = {}, jsx) => {
    const {text, icon} = button;
    return (
        <span>
            {icon ? <Icon type={icon}/> : false}&nbsp;&nbsp;
            {text ? text : ""}
            {jsx ? jsx : false}
        </span>
    );
};

const renderConfirm = (reference, item = {}) => () =>
    _renderPure(item.button);

const renderDialog = (reference, item) => () => {
    const {visible = {}} = reference.state;
    const $visible = visible[item.key];
    return _renderPure(item.button, (
        <DynamicDialog $dialog={item.dialog} $visible={$visible}>
            {item.key}
        </DynamicDialog>
    ));
};
const renderDrawer = (reference, item) => () => {

    return false;
};
const renderDirect = (reference, item) => () => {

    return false;
};
export default {
    DIALOG: renderDialog,
    DRAWER: renderDrawer,
    renderConfirm,
    renderDirect,
}