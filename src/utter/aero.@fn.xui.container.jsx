import Ux from 'ux';
import React from 'react';
import __Sk from './aero.__.fn.seek.configuration';

export default (container = {}, UI = {}, inherit, fnJsx) => {
    const fnRender = Ux.isFunction(fnJsx) ? fnJsx : () => false;
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
            __Sk.seekInherit(attrs, container);
            /*
             * 容器的特殊点处理
             * $fabric 需要下放，继承往下处理
             */
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