import {_Locator} from "./allocation.__.c.locator.navigation";
import __Rv from './allocation.__.fn.resolve.navigation';
import React from 'react';
import {Breadcrumb} from 'antd';
import Ux from 'ux';
import __Zn from './zero.module.dependency';
import {HomeOutlined} from "@ant-design/icons";

const __buildHome = (reference) => {
    const locator = _Locator.create(reference);
    const keyPage = locator.keyPage();
    const {$menuData = []} = reference.state ? reference.state : {};
    const found = Ux.elementUnique($menuData, 'key', keyPage);
    const isHome = found && Ux.Env.ENTRY_ADMIN.endsWith(found.uri);
    const fontSize = __Zn.toFontSize() + 6;
    if (isHome) {
        return false;
    } else {
        const item = {};
        item.key = "keyHome";
        item.title = (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a href={""} onClick={event => {
                Ux.prevent(event);
                locator.goHome();
            }}>
                <HomeOutlined style={{fontSize, color: "red"}}/>
            </a>
        )
        return item;
    }
}
const __buildPage = (reference, each = {}) => {
    const uri = each.uri;
    const item = Ux.clone(each);
    if (Ux.Env.VALUE.MENU_EXPAND !== uri) {
        const locator = _Locator.create(reference);
        return {
            key: item.key,
            title: (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a href={""} onClick={event => {
                    Ux.prevent(event);
                    if (Ux.Env.MENU_TYPE.BAG === item.type) {
                        locator.goApp(item);
                    } else {
                        locator.goPage(item);
                    }
                }}>
                    {item.text}
                </a>
            )
        }
    } else {
        return {
            key: item.key,
            title: item.text,
        }
    }
}
/**
 * ## 「标准」`Ux.yoProPageHeader`
 * @memberOf module:yo/unfold
 * @param reference
 * @return {*}
 */
const yoProPageHeader = (reference) => {
    const locator = _Locator.create(reference);
    const navigator = locator.yoNav();
    const page = {};
    page.title = false;
    if (!__Rv.resolvePwd(reference)) {
        // 非密码页
        const header = {};
        header.breadcrumbRender = () => {
            const items = [];
            items.push(__buildHome(reference))
            navigator
                .filter(item => !Ux.Env.ENTRY_ADMIN.endsWith(item.uri))
                .forEach(each => items.push(__buildPage(reference, each)))
            return (
                <Breadcrumb items={items.filter(item => !!item)}/>
            )
        };
        page.header = header;
    }
    return page;
}
export default {
    yoProPageHeader,
}