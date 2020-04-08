import Ux from 'ux';
import U from 'underscore';
import React from 'react';
import Cmn from './I.common';

/**
 * ## 扩展函数
 *
 * 执行 `xuiContainer` 专用容器控件渲染。
 *
 * @memberOf module:_xui
 * @method xuiContainer
 * @param {Object} container 容器配置信息
 * @param {Object} UI 组件配置
 * @param {Object} inherit 将被继承的属性表
 * @param {Function} fnJsx 容器中组件渲染专用函数
 * @returns {boolean|Jsx} 渲染带容器的组件信息
 */
export default (container = {}, UI = {}, inherit, fnJsx) => {
    const fnRender = U.isFunction(fnJsx) ? fnJsx : () => false;
    if (Ux.isEmpty(container)) {
        // 无容器
        return fnRender();
    } else {
        const Component = UI[container.name];
        if (Component) {
            const {config = {}} = container;
            const attrs = Ux.clone(inherit);
            /*
             * 覆盖 config
             */
            attrs.config = config;
            Cmn.seekInherit(attrs, container);
            const sorted = Ux.sorterObject(attrs);
            return (
                <Component {...sorted}>
                    {fnRender()}
                </Component>
            )
        } else {
            // 无容器
            console.error(`[ Ox ] 设置了容器但未找到，name = ${container.name}`);
            return fnRender();
        }
    }
}