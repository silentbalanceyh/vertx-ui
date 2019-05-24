import React from 'react';
import Dialog from '../IxDialog/UI';
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
            <Dialog {...config}>
                {jsxResult}
            </Dialog>
        )
    } else if (popover) {
        /* 渲染浮游窗口 */

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
            inherit.config = $componentConfig[componentKey];
            inherit.fnClose = fnClose;
            inherit.fnSubmit = fnSubmit;
            return (
                <Component {...reference.props}
                           {...inherit}/>
            )
        }
    } else return jsx;
};
export default {
    jsxDialog,
    jsxComponent
}