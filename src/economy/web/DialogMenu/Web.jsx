import React from 'react';
import {Button, Drawer, Dropdown, Icon, Menu} from 'antd';
import Dialog from '../Dialog/UI';
import Ux from "ux";
import Fn from "../../_internal/ix";

const getChildren = (reference, item = {}) => {
    const {$component = {}} = reference.props;
    // 初始化数据专用
    const Component = $component[item.key]
    if (Component) {
        // 「LIMIT」限制继承
        const inherits =
            Ux.toLimit(reference.props, Fn.Limit.DialogMenu.Filter);
        // doSubmitting
        inherits.doSubmitting = ($submitting = true) => {
            // 防提交专用函数
            reference.setState({$submitting});
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
        const dialog = Ux.clone(config.dialog);
        // Mode
        const {mode, ...rest} = dialog;
        const jsx = getChildren(reference, config);
        if ("DRAWER" === mode) {
            return (
                <Drawer key={config.key}
                        {...rest}
                        visible>
                    {jsx}
                </Drawer>
            )
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
    return (
        <Dropdown key={item.key} disabled={rest.disabled}
                  overlay={
                      <Menu onClick={onClick}>
                          {children.map(child => (
                              <Menu.Item key={child.key} data={child}
                                         disabled={$disabled.includes(child.key)}>
                                  {(() => {
                                      const {text, icon} = child.button
                                      return (
                                          <span>
                                              {icon ? <Icon type={icon}/> : false}&nbsp;&nbsp;
                                              {text ? text : ""}
                                          </span>
                                      );
                                  })()}
                              </Menu.Item>
                          ))}
                      </Menu>
                  }>
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