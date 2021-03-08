import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import Rdr from './Web.jsx';

/**
 * ## 「组件」`ExAction`
 *
 * ```js
 * import { ExAction } from 'ei';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|x|x|
 *
 * ### 2. 核心点
 *
 * #### 2.1. 按钮分流操作
 *
 * Action分流，包含几种：
 *
 * 1. 普通的Button
 *      1. 带有tooltip的专用按钮。
 *      2. 不带tooltip的专用按钮。
 * 2. 带有窗口的Button
 *      1. 带有Modal弹出窗口按钮。
 *      2. 带有Drawer抽屉窗口按钮。
 *      3. 带有Popover浮游窗口按钮。
 *
 * #### 2.2. 配置数据
 *
 * $category默认为BUTTON类型，渲染`<Button/>`，如果为`LINK`则直接渲染链接，如果是BUTTON类型，系统根据长度计算是否包含`<Button.Group/>`。
 *
 * #### 2.3. 内置渲染
 *
 * * `ExButton`
 * * `ExDialog`：根据类型计算，type值不为`NONE`
 *
 * @memberOf module:web-component
 * @method ExAction
 *
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
            if (Ux.isEmpty(config)) {
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