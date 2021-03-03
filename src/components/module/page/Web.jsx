import Oi from 'oi';
import Ex from 'ex';
import Ux from 'ux';
import React from 'react';
import U from 'underscore';

const getContainer = (reference) => {
    const {$container} = reference.props;
    if ($container) {
        const Component = Oi[$container.name];
        if (Component) {
            /*
             * 容器只使用配置
             */
            const inherit = Ex.yoAmbient(reference);
            inherit.config = $container.config ? $container.config : {};
            inherit.key = $container.key;
            return {
                Component,
                inherit,
            }
        } else {
            Ux.dgDebug($container, "[ Ex ] 未找到对应容器", "red");
        }
    }
};
/*
 * 带容器和不带容器合并
 * 1）带容器需要设置容器
 */
export default (reference, fnJsx) => {
    let container = getContainer(reference);
    if (container) {
        const {Component, inherit = {}} = container;
        return (
            <Component {...inherit}>
                {U.isFunction(fnJsx) ? fnJsx() : false}
            </Component>
        )
    } else {
        return U.isFunction(fnJsx) ? fnJsx() : false
    }
};