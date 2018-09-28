import React from 'react'
import './Cab.less'
import {DynamicDialog} from "web";
import {Button, Drawer, Popover} from 'antd';
import Ux from 'ux';

const getChildren = (reference) => {
    const {children, $content: Component} = reference.props;
    // 优先取children
    if (children) {
        return React.Children.map(children, child => {
            if (child instanceof React.Component) {
                return React.cloneElement(child, {
                    fnClose: () => reference.setState({visible: false}),
                    ...Ux.toUniform(reference.props)
                });
            } else return child
        })
    }
    // 其次取$content，必须执行Jsx的转换
    if (Component) {
        return (
            <Component fnClose={() => reference.setState({visible: false})}
                       {...Ux.toUniform(reference.props)}/>
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
    const {visible = false, dialog = {}} = reference.state;

    return (
        <Drawer {...dialog} visible={visible}>
            {jsx}
        </Drawer>
    );

};
const renderPopover = (reference) => {
    const jsx = getChildren(reference);
    const {visible = false, dialog = {}} = reference.state;
    const config = Ux.clone(dialog);
    // 是否处理关闭
    if (config.closable) {
        const title = config.title;
        config.title = (
            <span className={"dialog-header"}>
                {title}
                <Button icon={"close"} shape={"circle"}
                        size={"small"}
                        onClick={config.onClose}/>
            </span>
        )
    }
    return (
        <Popover trigger={"click"}
                 title={config.title}
                 placement={config.placement}
                 visible={visible}
                 overlayStyle={{width: config.width}}
                 content={jsx}/>
    );

};
export default {
    DIALOG: renderDialog,
    DRAWER: renderDrawer,
    POPOVER: renderPopover
}