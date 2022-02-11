import {Breadcrumb, Button, Menu, Tooltip} from "antd";
import React from "react";
import Unit from './web-unit';
import Abs from '../abyss';
import E from '../error';
import T from '../unity';

import {ContextMenu, MenuItem} from "react-contextmenu";

/**
 * ## 「标准」`Ux.aiBreadcrumb`
 *
 * 面包屑的渲染，使用Ant中的`<Breadcrumb/>`元素执行导航渲染
 *
 * 1. 外层使用`<Breadcrumb/>`。
 * 2. 元素使用`<Breadcrumb.Item/>`。
 * 3. 元素内使用`Ux.aiLink`方法渲染链接地址。
 *
 * @memberOf module:web-ai
 * @param {Array} items 每一个链接的配置信息
 * @param {Object} rest 根属性对象
 * @param {Object} addOn 附加属性，应用于内容层
 * @returns {JSX.Element}
 */
const aiBreadcrumb = (items = [], rest = {}, addOn = {}) => (
    <Breadcrumb {...rest}>
        {items.map(item => (
            <Breadcrumb.Item key={item.key}>
                {Unit.aiLink(item, addOn)}
            </Breadcrumb.Item>
        ))}
    </Breadcrumb>
);

const SubMenu = Menu.SubMenu;
/*
 * 分支控制器
 */
const aiMenuBranch = (item = {}, rest = {}, addOn = {}) => {
    if (item.children && 0 < item.children.length) {
        const attrs = {...item};
        attrs.title = Unit.aiTitle(item, addOn);
        return aiMenuSub(attrs, child => aiMenuBranch({
            ...child,
            className: _toBranchClass(child)
        }, addOn));
    } else {
        const attrs = {...item};
        return aiMenuItem(attrs, addOn)
    }
};
/*
 * 分支中的节点内容
 */
const aiMenuSub = (item = {}, fnRender) => (
    <SubMenu {...item}>
        {Abs.isFunction(fnRender) ? item.children.map(child => fnRender(child)) : false}
    </SubMenu>
);
/*
 * 分支中的子节点内容
 */
const aiMenuItem = (item = {}, addOn = {}) => (
    <Menu.Item key={item.key} data={item}>
        {Unit.aiTitle(item, addOn)}
    </Menu.Item>
);
// ------------------- 上边为特殊方法 -----------------------
/*
 * items: 数组 Array，一般是 children
 * rest：当前节点的属性信息
 * addOn：附加，主要使用 $router
 */
/*
 * 特殊方法，顶部菜单
 */
const aiMenuTop = (items = [], rest = {}, addOn = {}) => (
    <Menu {...rest}>
        {items.map(item => item.divide ? (
            <Menu.Divider key={item.key}/>
        ) : (
            <Menu.Item key={item.key} data={item}>
                {Unit.aiIcon(item.icon)}
                &nbsp;&nbsp;
                {Unit.aiLink(item, addOn)}
            </Menu.Item>
        ))}
    </Menu>
);

const aiMenuContext = (items = [], rest = {}) => (
    <ContextMenu className="context-menu" {...rest}>
        {items.map(item => (
            <MenuItem key={item.key}
                      onClick={item.onClick ? item.onClick : () =>
                          E.fxTerminal(true, 10017, item.onClick)}>
                {Unit.aiIcon(item.icon)}&nbsp;&nbsp;{item.text}
            </MenuItem>
        ))}
    </ContextMenu>
);
const _toBranchClass = (item) => {
    const level = item.hasOwnProperty("level") ? item.level : (item._level);
    let className = 0 < item.children.length ? `ux-submenu${level}` : `ux-menuitem${level}`;
    if (item.collapsed) {
        className = `${className} ux-collapsed${level}`;
    }
    return className;
};
/*
 * 特殊方法，左边菜单
 */
const aiSider = (items = [], rest = {}, addOn = {}) => {
    if (!rest.className) {
        rest.className = "";
    }
    rest.className = `ux-menu ${rest.className}`;
    const {
        defaultOpenKeys = [],
        defaultSelectedKeys = []
    } = rest;
    return (
        <Menu {...rest}>
            {items.map(item => {
                return aiMenuBranch({
                    ...item,
                    className: _toBranchClass(item),
                    defaultOpenKeys,
                    defaultSelectedKeys,
                }, rest, addOn);
            })}
        </Menu>
    );
};

const aiLinkMore = (config = {}, reference) => {
    if (config.icon && config.text) {
        return (
            <Tooltip title={config.text}>
                <Button icon={config.icon} shape={"circle"}
                        size={"small"}
                        onClick={(event) => {
                            event.preventDefault();
                            T.toRoute(reference, config.uri);
                        }}/>
            </Tooltip>
        )
    } else return false;
};
const aiLinkBack = (reference, attrs = {}) => {
    return (
        <Button shape={"circle"} className={"ux-red"} icon={"close"}
                onClick={event => {
                    Abs.prevent(event);
                    T.toOriginal(reference);
                }}
        />
    )
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    aiBreadcrumb,       // （面包屑）<Breadcrumb/>
    aiMenuTop,          // （完整）带 <Menu/>
    aiSider,            // （完整）带 <Menu/>
    aiMenuContext,      // （完整）右键菜单专用 <ContextMenu/>

    aiLinkMore,         // （按钮）<Button/>
    aiLinkBack,         // （按钮）<Button/>
}