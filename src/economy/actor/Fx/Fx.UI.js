import React from 'react';
import Window from '../IxDialog/UI';
import Popover from '../IxPopover/UI';
import UIS from '../Ex/UI';
import U from 'underscore';
/*
 * 窗口统一渲染
 */
const jsxDialog = (reference, jsx) => {
    const {
        window,
        popover,
        fnClose,
        $visible = false,
        $loading = false
    } = reference.state;
    const config = {};
    config.$visible = $visible;
    config.$loading = $loading;
    config.fnClose = fnClose;
    if (window) {
        /* 渲染窗口 */
        config.$config = window;
        const jsxResult = jsxComponent(reference, jsx);
        return (
            <Window {...config}>
                {jsxResult}
            </Window>
        )
    } else if (popover) {
        /* 渲染浮游窗口 */
        config.$config = popover;
        const jsxResult = jsxComponent(reference, jsx);
        return (
            <Popover {...config}>
                {jsxResult}
            </Popover>
        )
    } else return false;
};
const jsxComponent = (reference, jsx) => {
    const {$config = {}, $componentConfig = {}} = reference.props;
    const {component = "", componentKey = ""} = $config;
    const Component = UIS[component];
    if (undefined === jsx) {
        if (U.isFunction(Component)) {
            const {
                fnClose,
                fnSubmit,
            } = reference.state;
            const inherit = {};
            inherit.$config = $componentConfig[componentKey];
            inherit.fnClose = fnClose;
            inherit.fnSubmit = fnSubmit;
            return (
                <Component {...reference.props}
                    // 会出现覆盖，这里生成的 $config 会覆盖掉 原始的 $config
                           {...inherit}/>
            )
        }
    } else return jsx;
};
export default {
    jsxDialog,
    jsxComponent
}