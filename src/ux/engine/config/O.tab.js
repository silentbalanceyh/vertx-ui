import R from '../expression';
import U from "underscore";
import Fn from '../functions';
import {Tabs} from "antd";
import Abs from '../../abyss';

import webUnit from '../web-unit';
import webField from '../web-field';

const configTab = (reference, config = {}) => {
    const tabs = Abs.clone(config);
    const {
        tabPosition, items
    } = tabs;
    /*
     * 处理 tabs，解析分两种模式，主要针对 items
     * 1）全字符串格式：key,value;key,value
     * 2）数组格式：["key,value","key,value"]
     */
    if ("string" === typeof items) {
        // 第一种格式化
        tabs.items = R.aiExprTabs(items.split(';')
        /*
         * 除去空字符串
         */
            .filter(item => "" !== item));
    } else {
        if (U.isArray(items)) {
            tabs.items = R.aiExprTabs(items);
        }
    }
    /*
     * children 专用渲染
     */
    tabs.items = Fn.toChildItem(tabs.items, reference, Tabs.TabPane);
    /*
     * 临时解决方案
     */
    tabs.items.forEach((item = {}) => {
        const {icon, tab} = item;
        if ("string" === typeof tab && icon) {
            if ("left" === tabPosition || "right" === tabPosition) {
                item.tab = webUnit.aiBlock(icon, tab, item.key);
            }
        }
    });
    /*
     * tabBarExtraContent解析（和PageCard中类似）， 构造 tabBarExtraContent 的 render 函数
     */
    if (U.isArray(tabs.tabBarExtraContent)) {
        const content = R.aiExprButtons(tabs.tabBarExtraContent, reference.props);
        /*
         * 无状态解析
         */
        tabs.fnExtra = () => {
            /*
             * Render 的生成周期，构造 Extra 的状态，比如禁用等
             */
            return webField.aiButtonGroup(reference, content);
        }
    } else if (U.isObject(tabs.tabBarExtraContent)) {
        /*
         * 有状态解析
         */
        tabs.onTabClick = ($activeKey) => {
            /*
             * 激活的 activeKey 设置
             */
            reference.setState({$activeKey});
            const {rxTabClick} = reference.props;
            if (U.isFunction(rxTabClick)) {
                rxTabClick($activeKey);
            }
        };
        /*
         * 计算有状态的 fnExtra
         */
        const normalized = {};
        Abs.itObject(tabs.tabBarExtraContent, (field, value) =>
            normalized[field] = R.aiExprButtons(value, reference.props));
        tabs.activeKey = tabs.defaultActiveKey;
        tabs.fnExtra = () => {
            /*
             * render部分
             */
            const {$activeKey} = reference.state ? reference.state : {};
            const content = normalized[$activeKey];
            return webField.aiButtonGroup(reference, content);
        }
    }
    if (!tabs.onTabClick) {
        const {rxTabClick} = reference.props;
        if (U.isFunction(rxTabClick)) {
            tabs.onTabClick = rxTabClick;
        }
    }
    return tabs;
};

export default {
    configTab
}