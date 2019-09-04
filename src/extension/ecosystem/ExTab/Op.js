import Ux from 'ux';
import U from 'underscore'
import {Tabs} from 'antd';

const yiTab = (reference) => {
    const {config = {}} = reference.props;
    const tabs = Ux.clone(config);
    /*
     * 解析分两种模式，主要针对 items
     * 1）全字符串格式：key,value;key,value
     * 2）数组格式：["key,value","key,value"]
     */
    if ("string" === typeof tabs.items) {
        // 第一种格式化操作
        tabs.items = Ux.aiExprTabs(tabs.items.split(';'));
    } else {
        if (U.isArray(tabs.items)) {
            tabs.items = Ux.aiExprTabs(tabs.items);
        }
    }
    /*
     * children 专用的渲染
     */
    tabs.items = Ux.toChildItem(tabs.items, reference, Tabs.TabPane);
    /*
     * 临时解决方案
     */
    const {tabPosition} = tabs;
    tabs.items.forEach((item = {}) => {
        const {icon, tab} = item;
        if ("string" === typeof tab && icon) {
            if ("left" === tabPosition || "right" === tabPosition) {
                item.tab = Ux.aiBlock(icon, tab, item.key);
            }
        }

    });
    const state = {};
    // tabBarExtraContent解析（和PageCard中类似）， 构造 tabBarExtraContent 的 render 函数
    if (tabs.tabBarExtraContent) {
        const content = Ux.aiExprButton(tabs.tabBarExtraContent, reference.props);
        // 构造 fnExtra
        state.fnExtra = () => {
            /*
             * Render 的生成周期，构造 Extra 的状态，比如禁用等
             */
            return Ux.aiButtonGroup(reference, content);
        };
    }
    state.$tabs = Ux.clone(tabs);
    state.$ready = true;
    reference.setState(state);
};
export default {
    yiTab
}