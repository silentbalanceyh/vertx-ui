import U from 'underscore';
import React from 'react';
import Ux from 'ux';

function aiChild() {
    /*
     * length = 1，在 jsx 中渲染
     * length = 2, 针对单个 child 执行 fnChild 级别的渲染（带拷贝）
     */
    if (1 === arguments.length) {
        const child = arguments[0];
        const {fnChild, container: Component, ...rest} = child;
        if (U.isFunction(fnChild)) {
            if (Component) {
                /*
                 * 包含了外层容器的联动渲染
                 */
                return (
                    <Component {...rest}>
                        {fnChild(rest)}
                    </Component>
                );
            } else {
                return fnChild(rest);
            }
        } else {
            console.warn("[ Ux ] 未检测到 fnChild 函数", child);
            return false;
        }
    } else {
        const children = arguments[0];
        const additional = arguments[1];
        if (Ux.isEmpty(additional)) {
            return children;
        } else {
            /*
             * 暂时只合并配置 config
             */
            if (additional && additional.config
                && children.props.config) {
                /* 合并配置到 additional 中的 config，构造合并后的配置
                *  componentConfig + container构造的新的 config
                *  针对组件：
                *  1）List
                *  2）Form
                * */
                const {$form = {}} = children.props.config;
                additional.$form = Ux.clone($form);
            }
            return React.cloneElement(children, {
                ...additional
            });
        }
    }
}

const aiChildren = (reference, additional = {}) => {
    const {children} = reference.props;
    if (children) {
        if (U.isArray(children)) {
            /*
             * 数组对象
             */
            return children
                .filter(item => undefined !== item)
                .map(child => aiChild(child, additional));
        } else {
            /*
             * 单独唯一的对象
             */
            return aiChild(children, additional);
        }
    } else {
        /*
         * React中没有 children 变量（无子组件）
         */
        return false;
    }
};
export default {
    aiChildren,
    aiChild,
}