import __Zn from './zero.module.dependency';
import {Button} from "antd";
import React from "react";
import __BTN from './autonomy.fn.ai.unit.buttons';
import __UNIT from './autonomy.fn.ai.unit.element';
import __CHILD from './autonomy.fn.ai.child';
import __V4 from './aureole.fn.ai.child.v4.patch';

const Jsx = {
    ...__BTN,
    ...__UNIT,
    ...__CHILD,
    ...__V4,
}

const configDialog = (reference, config = {}) => {
    const $dialog = __Zn.aiExprWindow(config);
    /*
     * 使用解析结果来拷贝
     */
    const $config = __Zn.clone($dialog);
    /*
     * onOk按钮（可以不包含 onOk）
     */
    if ("string" === typeof $config.onOk) {
        $dialog.__onOk = $config.onOk;
        $dialog.onOk = () => __Zn.connectId($config.onOk);
    }
    /*
     * onCancel按钮
     */
    $dialog.onCancel = () =>
        __Zn.of(reference).hide().done();
    // reference.?etState({$visible: false});
    $dialog.destroyOnClose = true;
    $dialog.maskClosable = false;
    $dialog.className = "ux_dialog";   // 默认窗口风格
    /*
     * 防重复提交
     */
    const {$visible = false} = reference.state ? reference.state : {};
    const $submitting = __Zn.isLoading(reference);
    // V4 visible -> open
    $dialog.open = $visible;
    $dialog.confirmLoading = $submitting;
    $dialog.cancelButtonProps = {
        loading: $submitting
    };
    // 专用外围按钮处理
    if (!$dialog.okText) {
        $dialog.footer = (
            <Button type={"primary"}
                    onClick={$dialog.onCancel}
                    loading={$submitting}>
                {$dialog.cancelText}
            </Button>
        )
    }
    return $dialog;
};
const configTab = (reference, config = {}) => {
    const tabs = __Zn.clone(config);
    const {
        tabPosition, items
    } = tabs;


    // -------------- items 构造
    /*
     * 处理 tabs，解析分两种模式，主要针对 items
     * 1）全字符串格式：key,value;key,value
     * 2）数组格式：["key,value","key,value"]
     */
    let $items = []
    if ("string" === typeof items) {
        // 第一种格式化
        $items = __Zn.aiExprTabs(items.toString().split(';')
            /*
             * 除去空字符串
             */
            .filter(item => "" !== item));
    } else {
        if (__Zn.isArray(items)) {
            $items = __Zn.aiExprTabs(items);
        }
    }
    /*
     * children 专用渲染
     */
    $items = Jsx.v4ChildItem($items, reference);
    // 旧代码：Jsx.aiChildItem(tabs.items, reference, Tabs.?abPane);
    $items.forEach((item = {}) => {
        const {icon, tab} = item;
        if ("string" === typeof tab && icon) {
            if ("left" === tabPosition || "right" === tabPosition) {
                item.tab = Jsx.aiBlock(icon, tab, item.key);
            }
        }
    });
    tabs.items = $items;


    // -------------- fnExtra 构造
    /*
     * tabBarExtraContent解析（和PageCard中类似）， 构造 tabBarExtraContent 的 render 函数
     */
    const fnSwitch = ($activeKey) => {
        /*
         * 激活的 activeKey 设置
         */
        __Zn.of(reference).in({
            $activeKey
        }).handle(() => {

            const {rxTabClick} = reference.props;
            if (__Zn.isFunction(rxTabClick)) {
                rxTabClick($activeKey);
            }
        })
        // reference.?etState({$activeKey});
        // const {rxTabClick} = reference.props;
        // if (__Zn.isFunction(rxTabClick)) {
        //     rxTabClick($activeKey);
        // }
    };
    if (__Zn.isArray(tabs.tabBarExtraContent)) {
        const content = __Zn.aiExprButtons(tabs.tabBarExtraContent, reference.props);
        /*
         * 无状态解析
         */
        tabs.fnExtra = () => {
            /*
             * Render 的生成周期，构造 Extra 的状态，比如禁用等
             */
            return Jsx.aiButtonGroup(reference, content);
        }
    } else if (__Zn.isObject(tabs.tabBarExtraContent)) {
        /*
         * 有状态解析
         */
        tabs.onTabClick = fnSwitch;
        /*
         * 计算有状态的 fnExtra
         */
        if (__Zn.isFunction(tabs.tabBarExtraContent)) {
            tabs.fnExtra = tabs.tabBarExtraContent;
        } else {
            const normalized = {};
            __Zn.itObject(tabs.tabBarExtraContent, (field, value) =>
                normalized[field] = __Zn.aiExprButtons(value, reference.props));
            tabs.fnExtra = () => {
                /*
                 * render部分
                 */
                const {$activeKey} = reference.state ? reference.state : {};
                const content = normalized[$activeKey];
                return Jsx.aiButtonGroup(reference, content);
            }
        }
    }


    // -------------- onTabClick 构造
    if (!tabs.onTabClick) {
        if (tabs.hasOwnProperty('activeKey')) {
            tabs.onTabClick = fnSwitch;
        } else {
            const {rxTabClick} = reference.props;
            if (__Zn.isFunction(rxTabClick)) {
                tabs.onTabClick = rxTabClick;
            }
        }
    }
    return tabs;
};
export default {
    configDialog,
    configTab,
}