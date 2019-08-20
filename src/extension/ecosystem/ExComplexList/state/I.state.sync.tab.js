import Ux from "ux";
import Ex from 'ex';

export default (reference, config = {}) => {
    /* 第一个Tab页的初始化 */
    const {options = {}} = config;
    const tab = {};
    tab.tab = options[Ex.Opt.TABS_LIST];
    tab.key = Ux.randomUUID();
    tab.index = 0;
    tab.type = Ex.Mode.LIST;
    tab.closable = false;
    /* Tab 专用初始化 */
    const tabs = {items: [tab]};
    tabs.activeKey = tab.key;
    tabs.type = "editable-card";
    tabs.hideAdd = true;
    /* 统一 */
    tabs.onEdit = (key, action) => {
        if ("remove" === action) {
            /* 关闭 */
            Ex.rxTabClose(reference)(key, {
                $dirty: true,
            });
        }
    };
    /* Tab 专用风格初始化 */
    const {css = {}} = reference.props;
    const {
        clsTab = Ux.ECONOMY.TAB_CONTAINER
    } = css;
    tabs.className = clsTab;
    /* Tab 函数处理 */
    return tabs;
};