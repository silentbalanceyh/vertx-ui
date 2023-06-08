import __MP from './pedestal.fn.map.pipeline';
import __TO from "./pedestal.fn.to.web.control";
import Ux from "ux";

const TYPE_STYLE = {
    "EXTRA-MENU": {
        fontSize: __TO.toFontSize() + 6,        // 14 -> 20
    }
}
const __normBag = (item, bagMap = {}) => {
    // uiIcon Processing
    if (TYPE_STYLE.hasOwnProperty(item.type)) {
        item.uiStyle = TYPE_STYLE[item.type];
    } else {
        item.uiStyle = {};
    }
    /*
     * bag map processing
     * -- zero.crm
     * -- zero.oa
     * -- zero.resource
     */
    if (bagMap.hasOwnProperty(item.name)) {
        const bag = bagMap[item.name];
        item.desc = bag['nameFull'];
        // uiIcon processing
        item.icon = Ux.Env.ICON_BLOCK[bag['uiIcon']];
        item.bag = bag;                                                 // bag = BAG data
    } else {
        // cab: 格式
        if (item.icon.startsWith("cab:")) {
            const iconV = item.icon.split(":")[1];
            const iconKey = Ux.Env.ICON_BLOCK[iconV];
            item.icon = (<img src={iconKey} alt={item.name}/>);
        } else {
            item.icon = Ux.v4Icon(item.icon, {style: item.uiStyle});      // bag = v4 Font Size
        }
    }
    return item;
}
// Replaced old API: aiMenuTop
const __normBagMap = () => {
    const app = Ux.isInit();
    const {bags = []} = app;       // BAG-MENU ( 特殊类型 )
    // 按菜单类型分类 menuId = bags
    return Ux.elementMap(bags, 'entryId');
}
/**
 * ## 「标准」`Ux.a4MenuData`
 * menuData:
 * ```json
 * {
 *     bag: {},
 *     metadata: {},
 * }
 * ```
 *
 * menuNorm:
 * ```json
 * {
 *     key:
 *     label:
 *     icon:
 *     data: {
 *         ...菜单数据
 *     }
 * }
 * ```
 *
 * @memberOf module:v4/utter
 * @param menuData
 * @param config
 * @returns {*}
 */
const a4MenuData = (menuData = [], config = {}) => {
    /* 菜单处理 */
    const bagMap = __normBagMap();
    /* 菜单初始化 */
    return menuData
        /* 执行metadata 标准化，将 metadata 转换成 JSON */
        .map(item => __MP.mapMeta(item))
        /* bag 挂载（应用挂载专用）*/
        .map(item => __normBag(item, bagMap));
}
/**
 * ## 「标准」`Ux.a4MenuPick`
 * @memberOf module:v4/utter
 * @param menuData
 * @param type
 * @returns {*}
 */
const a4MenuPick = (menuData = [], type) => {
    const types = [];
    if ("string" === typeof type) {
        types.push(type);
    } else if (Ux.isArray(type)) {
        type.forEach(each => types.push(each))
    }
    return Ux.clone(menuData
        .filter(item => types.includes(item.type))
        .sort(Ux.sorterAscTFn('order')))

}
/**
 * ## 「标准」`Ux.a4MenuWeb`
 * @memberOf module:v4/utter
 * @param menuData
 * @param type
 * @returns {*}
 */
const a4MenuWeb = (menuData = [], type) => a4MenuPick(menuData, type).map(item => {
    const menuItem = {};
    menuItem.key = item.key;
    menuItem.label = item.text;
    if (item.icon) {
        menuItem.icon = item.icon;
    }
    menuItem.data = Ux.clone(item);
    return menuItem;
});
/**
 * ## 「标准」`Ux.a4MenuDash`
 * @memberOf module:v4/utter
 * @param menuData
 * @param reference
 * @param type
 * @returns {*}
 */
const a4MenuDash = (menuData = [], reference, type) => {
    const {$router} = reference.props;
    let source;
    if (Ux.isFunction(menuData.is)) {
        source = menuData.to(); // a4MenuPick(menuData.to(), type)
    } else {
        source = menuData; // a4MenuPick(menuData, type);
    }
    // 找到当前页
    const found = source
        .filter(item => Ux.Env.MENU_TYPE.BAG === item.type)
        .filter(item => 0 <= $router.path().indexOf(item.uri));
    if (1 !== found.length) {
        throw new Error("首页配置有误，请检查首页！！")
    }
    // 找到应用页
    const seek = a4MenuPick(source, type)
        .filter(item => item.parentId === found[0].key);
    return a4MenuData(seek).sort(Ux.sorterAscTFn('order'));
}
/**
 * ## 「扩展」`Ex.a4MenuAt`
 *
 * @memberOf module:v4/utter
 * @param menuData
 * @returns {*}
 */
const a4MenuAt = (menuData = []) => {
    const $menuSource = Ux.clone(menuData);
    const vector = {};
    $menuSource
        .filter(item => Ux.Env.MENU_TYPE.SIDE === item.type)
        .filter(item => Ux.Env.VALUE.MENU_EXPAND !== item.uri)
        .forEach(menu => {
            const branch = Ux.elementBranch(menuData, menu.key, "parentId");
            if (1 < branch.length) {
                const bag = branch[0];
                vector[menu.key] = bag.key;
            }
        });
    return vector;
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    a4MenuAt,
    // Step 01：标准化数据结构
    a4MenuData,
    // Step 02：过滤
    a4MenuPick,
    // Step 03：菜单呈现
    /*
     * {
     *     key,
     *     label,
     *     icon,
     *     data: {
     *         ...X_MENU
     *     }
     * }
     */
    a4MenuWeb,
    a4MenuDash,
}