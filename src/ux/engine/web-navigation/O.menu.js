import {Menu} from "antd";
import Unit from '../web-unit';
import React from "react";
import U from 'underscore';

const SubMenu = Menu.SubMenu;
/*
 * 分支控制器
 */
const aiMenuBranch = (item = {}, rest = {}, addOn = {}) => {
    if (item.children && 0 < item.children.length) {
        const attrs = {...item};
        attrs.title = Unit.aiTitle(item, addOn);
        return aiMenuSub(attrs, child => aiMenuBranch(child, addOn));
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
        {U.isFunction(fnRender) ? item.children.map(child => fnRender(child)) : false}
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
                {Unit.aiLink(item, addOn)}
            </Menu.Item>
        ))}
    </Menu>
);
/*
 * 特殊方法，左边菜单
 */
const aiSider = (items = [], rest = {}, addOn = {}) => {
    const {...menuAttrs} = rest;
    return (
        <Menu {...menuAttrs}>
            {items.map(item => {
                let className = 0 < item.children.length ? `ux-submenu${item.level}` : `ux-menuitem${item.level}`;
                if (item.collapsed) {
                    className = `${className} ux-collapsed${item.level}`;
                }
                return aiMenuBranch({
                    ...item,
                    className
                }, rest, addOn);
            })}
        </Menu>
    );
};
export default {
    aiMenuTop,          // （完整）带 <Menu/>
    aiSider,            // （完整）带 <Menu/>
}