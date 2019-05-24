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
    const {$loading = false} = reference.state;
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
            inherit.$loading = $loading;
            return (
                <Component {...reference.props}
                    // 会出现覆盖，这里生成的 $config 会覆盖掉 原始的 $config
                           {...inherit}/>
            )
        }
    } else return jsx;
};
const cssGrid = (config = {}) => {
    const {grid = 3} = config;
    const style = {};
    switch (grid) {
        case 5:
            style.width = "20%";
            break;
        case 4:
            style.width = "25%";
            break;
        case 3:
            style.width = "33.33%";
            break;
        case 2:
            style.width = "50%";
            break;
        case 1:
            style.width = "100%";
            break;
        default: {
            console.error("[OX] 暂时不支持该值：", grid);
            break;
        }
    }
    return style;
};
export default {
    jsxDialog,
    jsxComponent,
    cssGrid
}