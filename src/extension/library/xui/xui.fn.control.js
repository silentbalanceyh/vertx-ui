import React from 'react';
import Ux from 'ux';
import Cmn from './I.common';
import xuiContainer from './xui.fn.container';

export default (control = {}, UI = {}, inherit = {}) => {
    if (Ux.isEmpty(control)) {
        console.error("[ ExR ] 配置数据有问题，control = ", control);
        return false;
    } else {
        if (control.isContainer) {
            /*
             * 只渲染容器，不包含容器内部相关信息
             * 不传第四参，直接进入容器渲染过程
             */
            return xuiContainer(control.container, UI, inherit);
        } else {
            const Component = UI[control.name];
            if (Component) {
                /*
                 * 配置和数据解析
                 */
                const fnRender = () => {
                    const attrs = Ux.clone(inherit);
                    /*
                     * Component 专用流程
                     */
                    const data = Cmn.getData(inherit, control.source);
                    if (data) {
                        attrs.data = data;
                    }
                    const {event = {}, ...rest} = control.config;
                    attrs.config = rest;
                    /*
                     * 只有 Component 才出现的事件流程
                     */
                    attrs.event = event;
                    Cmn.seekInherit(attrs, control);
                    return (
                        <Component {...attrs}/>
                    )
                };
                if (control.container) {
                    return xuiContainer(control.container, UI, inherit, fnRender)
                } else {
                    return fnRender();
                }
            } else {
                console.error("[ ExR ] 配置的组件不存在", control, UI);
                return false;
            }
        }
    }
}