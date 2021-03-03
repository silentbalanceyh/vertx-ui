import React from 'react';
import {Drawer, Icon} from 'antd';
import Dialog from '../Dialog/UI';
import Ux from "ux";
import Fn from "../../_internal/ix";

const getChildren = (reference, item = {}) => {
    const {$content = {}, $inited} = reference.props;
    const componentKey = item.component;
    const Component = $content[componentKey];
    // 初始化数据专用
    const {init = true} = item;
    if (Component) {
        // 「LIMIT」限制继承
        const inherits = Ux.toLimit(reference.props, Fn.Limit.DialogMenu.Filter);
        const values = {};
        Object.keys($inited).filter(key => key.startsWith("_"))
            .forEach(key => values[key] = $inited[key]);
        return (
            <Component {...inherits}
                       $inited={init ? $inited : values}
                       $parent={$inited}
                       rxClose={() => {
                           const state = Ux.clone(reference.state);
                           state.visible[item.key] = false;
                           reference.setState(state);
                       }}/>
        );
    } else return false;
};

const renderItem = (reference, item = {}) => () => {
    const {text, icon} = item.button;
    return (
        <span>
            {icon ? <Icon type={icon}/> : false}&nbsp;&nbsp;
            {text ? text : ""}
        </span>
    );
};

const renderDialog = (reference, item) => () => {
    const {visible = {}} = reference.state;
    // 弹出对话框的房重复提交
    const {$loading} = reference.props;
    const $visible = visible[item.key];
    const jsx = getChildren(reference, item);
    return (
        <Dialog key={item.key}
                $dialog={item.dialog}
                $loading={$loading}
                $visible={$visible}>
            {jsx}
        </Dialog>
    );
};
const renderDrawer = (reference, item) => () => {
    const {visible = {}} = reference.state;
    const $visible = visible[item.key];
    const jsx = getChildren(reference, item);
    return (
        <Drawer key={item.key}
                {...item.dialog} visible={$visible}>
            {jsx}
        </Drawer>
    );
};
export default {
    renderItem,
    DIALOG: renderDialog,
    DRAWER: renderDrawer,
};