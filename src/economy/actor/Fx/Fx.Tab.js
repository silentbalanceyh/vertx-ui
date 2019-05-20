import Ux from 'ux';
import Action from './Fx.Action';

const init = (reference, options = {}) => {
    /*
     * 第一个Tab页初始化
     */
    const tab = {
        tab: options['tabs.list'],
        key: Ux.randomUUID(),
        type: "list",
        index: 0,
        closable: false,
    };
    const tabs = {items: []};
    tabs.items.push(tab);
    /*
     * Tab专用方法初始化
     */
    tabs.activeKey = tab.key;
    tabs.type = "editable-card";
    tabs.hideAdd = true;
    tabs.onTabClick = Action.rxClickTab(reference);
    tabs.onEdit = Action.rxEditTab(reference);
    /* className的注入 */
    const {className = Ux.ECONOMY.TAB_CONTAINER} = reference.props;
    tabs.className = className;
    return tabs;
};
const render = (reference) => {
    /* 读取 tabs */
    const {tabs = {}, options = {}} = reference.state;
    /* tabs限制计算 */
    const $tabs = Ux.clone(tabs);
    const {items = [], ...rest} = $tabs;
    /* limit限制 */
    let limit = Ux.valueInt(options['tabs.count']);
    if (0 === limit) limit = 1;
    items.forEach((item, index) => item.disabled = limit < items.length && 0 === index);
    return {items, ...rest};
};
export default {
    init,
    render
}