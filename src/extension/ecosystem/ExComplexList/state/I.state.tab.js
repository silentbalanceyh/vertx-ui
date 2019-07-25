import Ux from "ux";
import Opts from '../options';
import Page from '../page';

const {Option, Type} = Opts;

export default (reference, config = {}) => {
    /* 第一个Tab页的初始化 */
    const {options = {}} = config;
    const tab = {};
    tab.tab = options[Option.TABS_LIST];
    tab.key = Ux.randomUUID();
    tab.index = 0;
    tab.closable = false;
    /* 核心渲染方法 */
    tab.fnRender = Page[Type.LIST];
    /* Tab 专用初始化 */
    const tabs = {items: [tab]};
    tabs.activeKey = tab.key;
    tabs.type = "editable-card";
    tabs.hideAdd = true;
    /* Tab 函数处理 */
    return tabs;
};