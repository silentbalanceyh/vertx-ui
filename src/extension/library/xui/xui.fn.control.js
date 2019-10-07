import React from 'react';
import Ex from 'ex';
import Ux from 'ux';

import xuiContainer from './xui.fn.container';
import seekInherit from './xui.fn.inherit';

const getData = (inherit, source = "") => {
    /*
     * 读取上层引用
     */
    if (source) {
        const {reference} = inherit;
        const state = reference.state ? reference.state : {};
        const props = Ux.clone(inherit);
        return Ux.parseValue(source, {state, props});
    }
};

export default (control = {}, UI = {}, inherit = {}) => {
    if (Ux.isEmpty(control)) {
        console.error("[ ExR ] 配置数据有问题，control = ", control);
        return false;
    } else {
        const $control = Ex.yoControl(control);
        const Component = UI[$control.name];
        if (Component) {
            /*
             * 配置和数据解析
             */
            const fnRender = () => {
                const attrs = Ux.clone(inherit);
                const data = getData(inherit, $control.source);
                if (data) {
                    attrs.data = data;
                }
                /*
                 * 特殊配置处理，用于存储 control 特定的配置信息
                 */
                const {event = {}, ...rest} = $control.config;
                attrs.config = rest;
                attrs.event = event;
                seekInherit(attrs, $control);

                return (
                    <Component {...attrs}/>
                )
            };
            if ($control.container) {
                return xuiContainer($control.container, UI, inherit, fnRender)
            } else {
                return fnRender();
            }
        } else {
            console.error("[ ExR ] 配置的组件不存在", $control, UI);
            return false;
        }
    }
}