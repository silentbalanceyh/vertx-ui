/*
 * 追加 Item 中的 Icon 到子级的 icon 中，现阶段没找到合适的方法，该方法作为
 * 临时解决方案，让所有菜单中都可以看到对应的图标（图标存储于 X_MENU 中）
 * 直接在 MenuItem 中注入 icon 将每个菜单项的图标显示出来，形成每个菜单带
 * 图标的结构
 */
import React from "react";

const domItemIcon = (item, dom) => {
    /*
     * Element type is invalid: expected a string (for built-in components) or a class/function
     * (for composite components) but got: undefined. You likely forgot to export your component
     * from the file it's defined in, or you might have mixed up default and named imports.
     * Here the `item.icon` may be false
     */
    if (!item.icon) {
        return dom;
    }
    const iconJsx = React.cloneElement((
        <span className={"hook_menu_icon"}>
            {item.icon}
        </span>
    ), {
        key: `${dom.key}/icon/${item.key}`
    });
    return React.cloneElement(dom, {
        children: [
            // 针对每个子元素都需要包含 `key` 属性，这是 React 决定的
            iconJsx ? iconJsx : null,
            /* 原始的 title */
            dom?.props?.title
        ]
    });
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    domItemIcon
}