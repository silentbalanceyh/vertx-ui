import React from "react";
import "./Cab.less";
import U from "underscore";
import Ux from "ux";
import _Icon from "./Ux.Icon";
import Prop from "./Ux.Prop";
import Type from "./Ux.Type";
import Global from './Ux.Global';
import {
    Breadcrumb,
    Button,
    Checkbox,
    Col,
    Collapse,
    Icon,
    Menu,
    Modal,
    Radio,
    Row,
    Select,
    Steps,
    Tabs,
    Timeline,
    TreeSelect
} from "antd";
import {MenuItem} from "react-contextmenu";
import {Link} from "react-router-dom";

const Step = Steps.Step;
const SubMenu = Menu.SubMenu;

const _buildUri = (item = {}, $router = {}) => {
    if ("$MAIN$" === item.uri) {
        return Ux.Env.ENTRY_ADMIN;
    } else if ("$SELF$" === item.uri) {
        return $router ? $router.path() : "";
    } else {
        return item.uri;
    }
};

const _buildLink = (item = {}, $router) =>
    item.uri ? (
        <Link to={_buildUri(item, $router)} className={item.className}>
            {item.text}
        </Link>
    ) : (
        <span>{item.text}</span>
    );

const uiItemTitle = (item = {}, $router) => (
    <span className={item.className}>
        {_Icon.uiIcon(item.icon)}
        {_buildLink(item, $router)}
    </span>
);

const uiItemMenuTree = (item = {}, $router) =>
    item.children && 0 < item.children.length ? (
        <SubMenu key={item.key} title={uiItemTitle(item, $router)}>
            {item.children.map(child => uiItemMenuTree(child, $router))}
        </SubMenu>
    ) : (
        <Menu.Item key={item.key} style={item.style}>
            {uiItemTitle(item, $router)}
        </Menu.Item>
    );

const uiItemMenu = (item = {}, $router) =>
    item.divide ? (
        <Menu.Divider key={item.key}/>
    ) : (
        <Menu.Item key={item.key}>
            {_Icon.uiIcon(item.icon)}
            {_buildLink(item, $router)}
        </Menu.Item>
    );

const uiItemContextMenu = (item = {}, $router) => (
    <MenuItem key={item.key} onClick={item.onClick ? item.onClick : () => {
    }}>
        {_Icon.uiIcon(item.icon)}&nbsp;&nbsp;{item.text}
    </MenuItem>
);
const uiItemBreadcrumb = (item = {}, $router) => (
    <Breadcrumb.Item key={item.key}>
        {_buildLink(item, $router)}
    </Breadcrumb.Item>
);

const uiItemStep = (item = {}, $router) =>
    item.description ? (
        <Step
            title={item.title}
            key={item.key}
            description={item.description}
        />
    ) : (
        <Step title={item.title} key={item.key}/>
    );

const uiItemTabs = (tabs = {}, ...children) => (
    <Tabs {...tabs}>
        {tabs.items.map((item, index) => (
            <Tabs.TabPane {...item}>
                {children[index]
                    ? U.isFunction(children[index])
                        ? children[index](item)
                        : children[index]
                    : false}
            </Tabs.TabPane>
        ))}
    </Tabs>
);
const uiItemCollapse = (collapses = {}, ...children) => (
    <Collapse defaultActiveKey={collapses.defaultActiveKey}>
        {collapses.items.map((item, index) => (
            <Collapse.Panel {...item}>
                {children[index] ? children[index] : false}
            </Collapse.Panel>
        ))}
    </Collapse>
);
const uiItemTimeline = (items = {}, jsx = {}) => (
    <Timeline {...jsx}>
        {items
            ? items.map(item => {
                let className = item.onClick ? "ux-item" : "";
                className = `${className} ${
                    item.selected ? "ux-item-active" : ""
                    }`;
                return (
                    <Timeline.Item
                        className={className}
                        onClick={item.onClick ? item.onClick : () => {
                        }}
                        color={item.color ? item.color : "blue"}
                        key={item.key}
                    >
                        {item.text}
                        {item.onClick ? <Icon type="edit"/> : false}
                    </Timeline.Item>
                );
            })
            : false}
    </Timeline>
);
const uiItemOption = (items = [], jsx = {}) => {
    return (
        <Select {...jsx}>
            {items.map(item => (
                <Select.Option key={item.key} value={item.key}>
                    {item.name}
                </Select.Option>
            ))}
        </Select>
    );
};

const uiItemRadio = (items = [], jsx = {}) => {
    return (
        <Radio.Group {...jsx}>
            {items.map(item => (
                <Radio key={item.key} style={item.style ? item.style : {}}
                       value={item.hasOwnProperty('value') ? item.value : item.key}>
                    {item.name}
                </Radio>
            ))}
        </Radio.Group>
    )
};
const uiItemOptionMulti = (items = [], jsx = {}) => {
    const children = [];
    items.map(item =>
        children.push(
            <Select.Option key={item.key} value={`${item.key}`}>
                {item.name}
            </Select.Option>
        )
    );
    return <Select {...jsx}>{children}</Select>;
};
const uiItemTree = (items = [], jsx = {}) => {
    const data = Ux.Uarr.create(items)
        .sort((left, right) => left.left - right.left)
        .convert("code", (code, item) => item["code"] + " - " + item["name"])
        .mapping({
            id: "id",
            pid: "pid",
            label: "code",
            value: "id"
        })
        .tree("id", "pid")
        .to();
    return <TreeSelect treeData={data} {...jsx} />;
};
const uiDialogConfirm = (config = {}, execFunc) =>
    Modal.confirm({
        ...config,
        onOk: execFunc
    });
const uiItemCheckbox = (item = [], jsx) => {
    item = item.filter(item => item.key);
    item.forEach(each => {
        if (!each.value) {
            each.value = each.key;
        }
    });
    return <Checkbox.Group options={item} {...jsx}/>;
};
const uiItemDatum = (reference, key, filters) => {
    return (filters) ? Type.elementFind(Prop.onDatum(reference, key), filters) :
        Prop.onDatum(reference, key);
};
/**
 * 根据不同用户的角色值读取不同的UI
 * @method uiLoader
 * @param props
 * @param roles
 * @param roleCode
 */
const uiLoader = (props = {}, roles = {}, roleCode = "roleCode") => {
    const user = Global.isLogged();
    if (!user) return false;
    const role = user[roleCode];
    if (!role) return false;
    const Component = roles[role];
    if (!Component) return false;
    return (<Component {...props}/>)
};
/**
 * 根据传入的grid渲染Col/Row专用方法
 * @method uiGrid
 * @param grid
 * @param jsx
 */
const uiGrid = (grid = [], ...jsx) => {
    return (
        <Row>
            {grid.map((item, index) => (
                <Col span={item} key={Ux.randomString(12)}>
                    {jsx[index] ? jsx[index] : false}
                </Col>
            ))}
        </Row>
    )
};
/**
 * 根据传入的grid渲染Col/Row专用方法
 * @method uiIfElse
 * @param condition 判断条件
 * @param yesJsx condition = true时执行
 * @param noJsx condition = false时执行
 */
const uiIfElse = (condition, yesJsx, noJsx) =>
    (condition ? yesJsx : (undefined !== noJsx ? noJsx : false));
const uiBtnPrimary = (fnClick = () => {
}, text) => (
    <Button type="primary" onClick={fnClick}>
        {text}
    </Button>
);
const uiBtnHidden = (fnClick = () => {
}, id) => (
    <Button id={id} onClick={fnClick}/>
);
const uiBtnHiddens = (hidden = {}) => {
    const ids = Object.keys(hidden);
    if (0 < ids.length) {
        return (<div>
            {ids.map(id => (
                <Button id={id} onClick={U.isFunction(hidden[id]) ? hidden[id] : () => {
                    console.error(`[Zero] Inject function is invalid. id = ${id}`)
                }}/>
            ))}
        </div>)
    } else {
        return false;
    }
};
export default {
    uiGrid,
    uiLoader,
    uiIfElse,
    uiBtnHidden,
    uiBtnHiddens,
    uiBtnPrimary,

    uiItemRadio,
    uiItemDatum,
    uiItemRadioDatum: (reference, jsx = {}, key, filters) =>
        uiItemRadio(uiItemDatum(reference, key, filters), jsx),
    uiItemOption,
    uiItemOptionDatum: (reference, jsx = {}, key, filters) =>
        uiItemOption(uiItemDatum(reference, key, filters), jsx),
    uiItemOptionDatumMulti: (reference, jsx = {}, key, filters) => {
        jsx.mode = "multiple";
        return uiItemOptionMulti(uiItemDatum(reference, key, filters), jsx);
    },
    uiItemTreeDatum: (reference, jsx = {}, key, filters) =>
        uiItemTree(uiItemDatum(reference, key, filters), jsx),
    uiItemTimeline,
    uiItemTitle,
    uiItemMenuTree,
    uiItemContextMenu,
    uiItemMenu,
    uiItemBreadcrumb,
    uiItemStep,
    uiItemTabs,
    uiItemCollapse,
    uiItemCheckbox,
    uiDialogConfirm
};
