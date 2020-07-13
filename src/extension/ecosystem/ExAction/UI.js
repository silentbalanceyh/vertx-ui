import React from 'react';
import Ex from 'ex';
import Rdr from './Web.jsx';

/*
 * Action分流，包含几种：
 * 1）普通的 Button
 * -- 1.1. 带有 tooltip 的专用 button
 * -- 1.2. 不带 tooltip 的专用 button
 * 直接使用：<div><ExButton/></div>
 *
 * 2）带有窗口的 Button
 * -- 2.1. 带有 Modal 的 Button
 * -- 2.2. 带有 Drawer 的 Button
 * -- 2.3. 带有 Popover 的 Button
 * 直接使用：<div><ExButton/><ExDialog></ExDialog></div>
 */

class Component extends React.PureComponent {
    state = {
        $ready: true,   // 容器，无状态，直接干
    };

    render() {
        return Ex.yoRender(this, () => {
            /* 直接传，不进入状态 */
            const {config = [], $category = "BUTTON"} = this.props;
            /* 解析配置信息 */
            const attributes = Ex.yoAmbient(this);
            /*
             * Disabled-002：ExListComplex 传入 ExAction
             * 1）ExAction -> ExDialog
             * 2）ExAction -> ExButton
             */
            if (0 === config.length) {
                /* 无配置，不渲染任何内容 */
                return false;
            } else {
                const renderJsx = Rdr[$category];
                /* 类型信息处理 */
                attributes.$category = $category;
                return renderJsx(this, config, attributes);
            }
        }, Ex.parserOfColor("ExAction").action());
    }
}

export default Component;