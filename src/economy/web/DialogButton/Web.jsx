import React from 'react';
import './Cab.less';
import Dialog from '../Dialog/UI';
import {Button, Drawer, Popover} from 'antd';
import Ux from 'ux';
import Fn from "../../_internal/ix";

const getChildren = (reference) => {
    const {children, $content: Component} = reference.props;
    // 「LIMIT」限制继承
    const inherits = Ux.toLimit(reference.props, Fn.Limit.DialogButton.Filter);
    // 优先取children
    if (children) {
        return React.Children.map(children, child => {
            const type = Symbol.for("react.element");
            if (child instanceof React.Component) {
                return React.cloneElement(child, {
                    ...inherits,
                    rxClose: () => reference.setState({visible: false}),
                    /* rxClose 需要重写 */
                });
            } else if (child.$$typeof === type) {
                return React.cloneElement(child, {
                    ...inherits,
                    /* rxClose 需要重写 */
                    rxClose: () => reference.setState({visible: false}),
                });
            } else return child;
        });
    }
    // 其次取$content，必须执行Jsx的转换
    if (Component) {
        return (
            <Component rxClose={() => reference.setState({visible: false})}
                       {...inherits}/>
        );
    }
    return false;
};

const renderDialog = (reference) => {

    const {visible = false, dialog = {}} = reference.state;
    // 窗口中的房重复提交设置
    const {$loading} = reference.props;
    const jsx = getChildren(reference);
    return (
        <Dialog $dialog={dialog} $visible={visible}
                $loading={$loading}>
            {jsx}
        </Dialog>
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
            <span className={"web-dialog-button-header"}>
                {title}
                <Button icon={"close"} shape={"circle"}
                        size={"small"}
                        onClick={config.onClose}/>
            </span>
        );
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
};