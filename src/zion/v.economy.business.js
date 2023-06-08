import __V_ICON from './v.web.icon.set';
import __Zn from './zero.module.dependency';

const MENU_TYPE = {
    // 主站点菜单
    BAG: "BAG-MENU",        // APP入口
    SIDE: "SIDE-MENU",      // 左边菜单

    // 首页菜单
    SC: "SC-MENU",          // 主界面 Service Catalog 专用菜单
    NAV: "NAV-MENU",        // 导航栏专用（包含 SIDE-MENU 和 NAV-MENU
    REPO: "REPO-MENU",      // 库专用菜单（单独某个首页目前存在）

    // 辅助菜单
    TOP: "TOP-MENU",        // 顶部右上角菜单信息
    EXTRA: "EXTRA-MENU",    // 顶部辅助菜单

    // 开发中心
    DEV: "DEV-MENU",        // 开发中心：开发菜单
    SYS: "SYS-MENU",        // 开发中心：系统菜单
}
const MENUS = {
    // 模块主菜单
    MODULE: [
        MENU_TYPE.BAG,
        MENU_TYPE.SIDE,
    ],
    // 顶部菜单
    TOP: [
        MENU_TYPE.TOP,
        MENU_TYPE.EXTRA,
    ],
    // 首页菜单
    DASH: [
        MENU_TYPE.NAV,
        MENU_TYPE.REPO,
        MENU_TYPE.SC,
    ],
    DEVELOPMENT: [
        // 开发菜单
        MENU_TYPE.DEV,
        MENU_TYPE.SYS,
    ],
}
export default {
    // Env.V_IMAGE Applied
    ...__V_ICON.V_IMAGE,
    // MENU_TYPE
    MENU_TYPE,
    // MENUS Configuration
    MENUS,
    // Previous Value for Constant
    VALUE: {
        MENU_EXPAND: __Zn.Env.CV_EXPAND,
    },
    // Extension Part
    ECONOMY: {
        CARD_CONTAINER: "ux_card",     // PageCard / HelpCard最外层
        TAB_CONTAINER: "ux_tab",       // ComplexList / TabList
        ROW_HEAD: "ux_toolbar",        // 放在头部的间距文件
        TABLE_CONTROL: "ux_table",     // 表格组件专用
    },
    // Tree选择模式
    SELECTION: __Zn.Env.SELECTION,
    // REACTIVE / REACT / REDUX
    RX_SOURCE: __Zn.Env.RX_SOURCE,
    // ADD / EDIT / SEARCH / DESIGN
    FORM_MODE: __Zn.Env.FORM_MODE,
    XT_FORMAT: __Zn.Env.XT_FORMAT,
}