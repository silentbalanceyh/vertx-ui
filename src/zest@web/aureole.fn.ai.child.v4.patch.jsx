import __Zn from './zero.module.dependency';
import React from "react";

const __v4ChildOne = (child) => {
    const {fnChild, ...rest} = child;
    if (__Zn.isFunction(fnChild)) {
        /* 因为要调用函数，则直接执行 fnChild 时引入特殊属性触发 */
        const $rest = __Zn.clone(rest);
        $rest.children = fnChild($rest);
        $rest.label = $rest.tab;
        /*
         * item 结构
         * {
         *     key,
         *     label,
         *     children
         * }
         * 此处 fnChild 会被替换成 children 实现整体统一，不再需要
         * Component
         */
        return $rest;
    } else {
        __Zn.dgDebug({child}, "[ Ux ] 未检测到 fnChild 函数，返回 false", "red");
        return false;
    }
}
const __v4ChildTwo = (children, addOn) => {
    if (__Zn.isEmpty(addOn)) {
        return children;
    } else {
        /*
         * 暂时只合并配置 config
         */
        if (addOn && addOn.config && children.props.config) {
            /* 合并配置到 additional 中的 config，构造合并后的配置
            *  componentConfig + container构造的新的 config
            *  针对组件：
            *  1）List
            *  2）Form
            * */
            const {$form = {}} = children.props.config;
            addOn.$form = __Zn.clone($form);
        }
        return React.cloneElement(children, {
            ...addOn
        });
    }
}

/*
 * length = 1, 在 jsx 中渲染
 * length = 2, 针对单个 child 执行 fnChild 级别的渲染
 * 该方法暂时只适用于 Tabs.?abPane 子节点，该节点在 v4.0 版本之后会抛出警告
 */
function v4Child() {
    if (1 === arguments.length) {
        const child = arguments[0];
        return __v4ChildOne(child);
    } else {
        const children = arguments[0];
        const additional = arguments[1];
        return __v4ChildTwo(children, additional);
    }
}

/*
 * 「预处理」
 * 该方法主要用于构造 fnChild 用来执行 render 处理，该处理会在 `render()` 中调用
 * 通用之后，会生成每个 items 中的 children 来实现完整执行流，用于兼容 V4 中的
 * Tabs.?abPane 替换。
 */
const v4ChildItem = (items = [], reference) => {
    const {children} = reference.props;
    if (children) {
        let childRef = children;
        if (!__Zn.isArray(children)) {
            childRef = [children];
        }
        items.forEach((item, index) => {
            const element = childRef[index];
            if (element) {
                item.fnChild = (addOn = {}) => {
                    /* 必须在函数内作用域处理 */
                    const {value} = reference.props;
                    if (value) addOn.value = value;
                    return __v4ChildTwo(element, addOn);
                }
            }
            // 移除代码：特殊注入，注入容器
            // item.container = Component;
        });
        return items;
    } else return items;     // 无子组件，直接返回
}
const v4Items = (items = [], configuration = {}, reference) => {
    const {
        itemFn = item => item,  // 用于预处理item专用方法
        itemFnLabel,            // 用于预处理item.label专用方法
        childFn,                // 构造 children 专用方法
    } = configuration;
    return items.map((item, index) => {
        // 1. 预处理 itemFn
        const $item = itemFn(item, index);
        // 2. 构造 children
        if (__Zn.isFunction(childFn)) {
            const itemData = __Zn.clone($item);
            $item.children = childFn(itemData, reference, index);
        } else {
            $item.children = (<span>未传入 childFn</span>)
        }
        // 3. 附加属性设置
        if ($item.tab && !$item.label) {
            $item.label = $item.tab;
            delete $item.tab;
        }
        // 高优先级
        if (__Zn.isFunction(itemFnLabel)) {
            const label = itemFnLabel($item);
            if (label) {
                $item.label = label;
            }
        }
        // 执行完成后处理（Post Action）
        __Zn.remove($item,
            "fnChild",
            // 解决 fnRender 不存在的问题
            // "fnRender"
        );
        return $item;
    })
}
export default {
    v4Child,            // 替换 aiChild
    v4ChildItem,        // 替换 aiChildItem
    // 新方法两个
    v4Items,            // 新方法处理子项 items
}