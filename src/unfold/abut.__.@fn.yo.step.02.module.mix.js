import Ux from "ux";
import React from "react";
import {_Locator} from "./allocation.__.c.locator.navigation";
import __DOM from './aero.__.fn.dom.modification';
import __Rx from './aero.__.fn.rx.actions';

const __yoMenu = (reference) => {
    const locator = _Locator.create(reference);
    /*
     * selectedKeys: []
     * openKeys: []
     */
    const openKeys = locator.keyOpen();
    const selectedKey = locator.keyPage();
    return {
        // onOpenChange: (keys = []) => locator.goOpenChange(keys),
        onOpenChange: (keys = []) => locator.goOpen(keys),
        selectedKeys: openKeys.concat(selectedKey).filter(item => !!item),
        openKeys,
        className: "mix_menu"
        // selectedKeys: selectedKeys.concat(selectedPage),
        // openKeys,
    }
}
export default (reference) => {
    // layout = "mix"
    // yoMixModule ( function )
    const moduleConfig = {};
    moduleConfig.splitMenus = true;
    /*
     *  menu building for inject to
     *  - menuProps
     *  - menuRender
     *  - menuItemRender
     */
    moduleConfig.menuProps = __yoMenu(reference);
    moduleConfig.menuRender = (props, item) => {
        const locator = _Locator.create(reference);
        const menuData = locator.yoSider();
        return React.cloneElement(item, {
            menuData,
        });
    }
    moduleConfig.menuDataRender = (menuData = []) => {
        // Fix: 保证自动计算可控（如果不设置则菜单不显示）
        menuData.forEach(menu => {
            menu.path = Ux.Env.K_VALUE.SLASH;
        });
        return menuData;
    }
    moduleConfig.menuItemRender = (item, dom) => {
        // 图标呈现
        const $dom = __DOM.domItemIcon(item, dom);
        // 高亮显示
        // const attrs = __yoActive(reference, item);
        // console.log("Item", item);
        return (
            // eslint-disable-next-line
            <a className={"mix_menu_item"} onClick={__Rx.rxMenuOr(reference, item, dom)}>
                {$dom}
            </a>
        )
    };
    return moduleConfig;
}