import React from 'react';
import {Tooltip} from "antd";
import Ux from 'ux';

/**
 ## 「组件」`RowStar`
 *
 * @memberOf module:uca/economy
 * @method RowStar
 */
class Component extends React.PureComponent {
    render() {
        const {config = {}, value, rxStar} = this.props;
        const {size = 24} = config;
        // 基本属性
        const attrs = {};
        attrs.type = "star";
        attrs.className = "web-row-star";
        attrs.style = {fontSize: size};
        // 构造 Icon 属性
        if (Ux.isFunction(rxStar)) {
            attrs.onClick = () => rxStar(value);
        }
        if (value) {
            // 不显示在导航栏
            const {
                onText,
                onColor = "#F4B320"
            } = config;
            attrs.theme = "filled";
            attrs.style.color = onColor;
            return (
                <Tooltip title={onText}>
                    {Ux.v4Icon(attrs)}
                </Tooltip>
            );
        } else {
            // 显示在导航栏
            const {offText} = config;
            return (
                <Tooltip title={offText}>
                    {Ux.v4Icon(attrs)}
                </Tooltip>
            );
        }
    }
}

export default Component