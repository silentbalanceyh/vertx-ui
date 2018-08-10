import {Breadcrumb, Menu} from "antd";
import React from "react";
import {Link} from "react-router-dom";
import Ux from "ux";
import _Icon from "../Ux.Icon";

const SubMenu = Menu.SubMenu;

const _buildLink = (item = {}, $router) =>
    item.uri ? (
        <Link to={Ux.aiUri(item, $router)} className={item.className}>
            {item.text}
        </Link>
    ) : (
        <span>{item.text}</span>
    );
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
const aiTopMenu = (menus = [], rest = {}, config = {}) => (
    <Menu className="top-menu" onClick={config.onClick} {...rest}>
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
const aiMenuTree = (item = {}, rest = {}, config = {}) => (
    item.children && 0 < item.children.length ? (
        <SubMenu key={item.key} title={aiTitle(item, config['$router'])}>
            {item.children.map(child => aiMenuTree(child, config))}
        </SubMenu>
    ) : (
        <Menu.Item key={item.key} style={item.style}>
            {aiTitle(item, config['$router'])}
        </Menu.Item>
    )
);
export default {
    aiBreadcrumb,
    aiTopMenu,
    aiMenuTree
}