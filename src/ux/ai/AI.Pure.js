import {Breadcrumb, Collapse, Menu, Steps, Tabs} from "antd";
import {ContextMenu, MenuItem} from "react-contextmenu";
import React from "react";
import {Link} from "react-router-dom";
import Ux from "ux";
import U from 'underscore';
import _Icon from "../util/Ux.Icon";
import PureInput from './pure';

const SubMenu = Menu.SubMenu;

const aiElement = (children, index, ...args) => {
    if (undefined === index) {
        return children;
    } else {
        return U.isFunction(children[index])
            ? children[index].apply(this, [].concat(args))
            : children[index];
    }
};
const _buildLink = (item = {}, $router) => {
    if (item.uri) {
        return item.disabled ? (
            <span className={"zero-disabled"}>{item.text}</span>
        ) : (
            <Link to={Ux.aiUri(item, $router)} className={item.className}>
                {item.text}
            </Link>
        );
    } else return (
        <span>{item.text}</span>
    );
};
const aiTitle = (item = {}, $router) => (
    <span className={item.className}>
        {_Icon.uiIcon(item.icon)}
        {_buildLink(item, $router)}
    </span>
);
const aiBreadcrumb = (items = [], rest = {}, config = {}) => (
    <Breadcrumb {...rest}>
        {items.map(item => (
            <Breadcrumb.Item key={item.key}>
                {_buildLink(item, config['$router'])}
            </Breadcrumb.Item>
        ))}
    </Breadcrumb>
);
const aiMenuTop = (menus = [], rest = {}, config = {}) => (
    <Menu onClick={config.onClick} {...rest}>
        {menus.map(item => item.divide ? (
            <Menu.Divider key={item.key}/>
        ) : (
            <Menu.Item key={item.key}>
                {_Icon.uiIcon(item.icon)}
                {_buildLink(item, config['$router'])}
            </Menu.Item>
        ))}
    </Menu>
);
const aiMenuTree = (item = {}, rest = {}, config = {}) => {
    let adjustClass = 0 < item.children.length ? `ux-submenu${item.level}` : `ux-menuitem${item.level}`;
    if (item.collapsed) {
        adjustClass = `${adjustClass} ux-collapsed${item.level}`;
    }
    return item.children && 0 < item.children.length ? (
        <SubMenu key={item.key}
                 style={item.style}
                 className={adjustClass}
                 title={aiTitle(item, config['$router'])}>
            {item.children.map(child => aiMenuTree(child, config))}
        </SubMenu>
    ) : (
        <Menu.Item key={item.key}
                   style={item.style}
                   className={adjustClass}
                   disabled={item.disabled}>
            {aiTitle(item, config['$router'])}
        </Menu.Item>
    );
};
const aiTabs = (items = [], rest = {}, ...children) => (
    <Tabs {...rest}>
        {items.map((item, index) => (
            <Tabs.TabPane {...item}>
                {aiElement(children, index)}
            </Tabs.TabPane>
        ))}
    </Tabs>
);
const aiCollapse = (items = [], rest = {}, ...children) => (
    <Collapse {...rest}>
        {items.map((item, index) => (
            <Collapse.Panel {...item}>
                {aiElement(children, index)}
            </Collapse.Panel>
        ))}
    </Collapse>
);
const aiMenuContext = (items = [], rest = {}) => (
    <ContextMenu className="context-menu" {...rest}>
        {items.map(item => (
            <MenuItem key={item.key}
                      onClick={item.onClick ? item.onClick : () =>
                          Ux.E.fxTerminal(true, 10017, item.onClick)}>
                {_Icon.uiIcon(item.icon)}&nbsp;&nbsp;{item.text}
            </MenuItem>
        ))}
    </ContextMenu>
);
const aiSteps = (items = [], rest = {}) => {
    items.forEach(item => {
        if (!item.hasOwnProperty('key')) {
            item.key = Ux.randomUUID();
        }
    });
    return (
        <Steps {...rest}>
            {items.map(item => <Steps.Step {...item}/>)}
        </Steps>
    );
};
export default {
    // 输入框
    ...PureInput,
    // 菜单相关渲染
    aiMenuTree,
    aiMenuContext,
    aiMenuTop,
    aiBreadcrumb, // 面包屑
    aiCollapse,// 折叠面板
    aiTabs,// 页签
    aiSteps,// 纯帮助
};