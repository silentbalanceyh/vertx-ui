import R from '../expression';
import U from "underscore";
import Fn from '../functions';
import {Tabs} from "antd";
import Abs from '../../abyss';

import webUnit from '../web-unit';
import webField from '../web-field';

import callTab from './O.tab.jsx';

/**
 * ## 引擎函数
 *
 *
 * 「标准配置」Tabs 专用的配置信息。
 *
 * @memberOf module:_config
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Object} config 传入的配置数据信息。
 * @return {Object} 处理完成的配置数据。
 */
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
    const fnSwitch = ($activeKey) => {
        /*
         * 激活的 activeKey 设置
         */
        reference.setState({$activeKey});
        const {rxTabClick} = reference.props;
        if (U.isFunction(rxTabClick)) {
            rxTabClick($activeKey);
        }
    };
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
        tabs.onTabClick = fnSwitch;
        /*
         * 计算有状态的 fnExtra
         */
        const normalized = {};
        Abs.itObject(tabs.tabBarExtraContent, (field, value) =>
            normalized[field] = R.aiExprButtons(value, reference.props));
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
        if (tabs.hasOwnProperty('activeKey')) {
            tabs.onTabClick = fnSwitch;
        } else {
            const {rxTabClick} = reference.props;
            if (U.isFunction(rxTabClick)) {
                tabs.onTabClick = rxTabClick;
            }
        }
    }
    return tabs;
};
/**
 * ## 引擎函数
 *
 * （同步）Tabs 页签专用函数，用于处理页签级别的配置信息，通常是 _tabs 节点
 *
 * @memberOf module:_config
 * @param {ReactComponent} reference React对应组件引用。
 * @param {String} key 表单配置读取必须的键。
 * @return {any}
 */
const cabTab = (reference = {}, key = "tabs") => {
    const {$hoc} = reference.state;
    if ($hoc) {
        const tabs = $hoc._(key);
        if (!Abs.isEmpty(tabs)) {
            return configTab(reference, Abs.clone(tabs));
        } else return {};
    } else return {};
}
/**
 * ## 引擎函数
 *
 * （异步）Tabs 页签专用函数，用于处理页签级别的配置信息，通常是 _tabs 节点
 *
 * @memberOf module:_config
 * @param {ReactComponent} reference React对应组件引用。
 * @param {String} key 表单配置读取必须的键。
 * @param {Object} state 专用的状态，会被直接更改，追加 $tabs 变量。
 * @return {any}
 */
const capTab = (reference = {}, key = "tabs", state = {}) => {
    state.$tabs = cabTab(reference, key);
    return Abs.promise(state);
}
export default {
    // cabTab,
    capTab,
    callTab,
    configTab
}