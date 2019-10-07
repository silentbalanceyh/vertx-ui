import Ux from 'ux';
import U from 'underscore';
import React from 'react';
import seekInherit from './xui.fn.inherit';

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
            seekInherit(attrs, container);
            return (
                <Component {...attrs}>
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