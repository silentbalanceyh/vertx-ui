import Ux from 'ux';
import U from 'underscore';
import React from 'react';

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
            attrs.key = container.key;
            /*
             * 元数据统一处理
             */
            attrs._type = container.name;
            return (
                <Component {...attrs}>
                    {fnRender()}
                </Component>
            )
        } else {
            // 无容器
            return fnRender();
        }
    }
}