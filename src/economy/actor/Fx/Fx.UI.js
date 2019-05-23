import React from 'react';
import Dialog from '../IxDialog/UI';
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
        return (
            <Dialog {...config}>
                {jsx}
            </Dialog>
        )
    } else if (popover) {
        /* 渲染浮游窗口 */

    } else return false;
};
export default {
    jsxDialog
}