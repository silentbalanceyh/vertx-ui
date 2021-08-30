import Ux from 'ux';
import React from "react";
import {Tabs} from "antd";
import {Dialog} from 'web';

/**
 * ## 弹出窗口专用类
 *
 * @class IxDialog
 */
class IxDialog {
    constructor(reference, key = "window") {
        this.reference = reference;
        /* 窗口配置 */
        const window = Ux.fromHoc(reference, key);
        this.$dialog = Ux.configDialog(reference, window);
    }

    child(uiSupplier) {
        if (Ux.isFunction(uiSupplier)) {
            this.$ui = uiSupplier;
        }
        return this;
    }

    footer(fnRender) {
        // 改变成函数
        if (Ux.isFunction(fnRender)) {
            this.$footer = fnRender;
        }
        return this;
    }

    onMount(state) {
        state.__dialog = this;
        state.$visible = false;
        state.$submitting = false;
        return state;
    }

    onOpen(data = {}) {
        this.reference.setState({
            $inited: data,
            $visible: true,
            $submitting: false
        });
    }

    onClose(state = {}) {
        this.reference.setState({
            $inited: undefined,
            $visible: false,
            $submitting: false,
            $loading: false,
            ...state,
        })
    }

    onSubmit(arg1, $submitting = true) {
        if (0 === arguments.length) {
            // 调用模式 onSubmit()
            this.reference.setState({
                $submitting: true,
                $loading: true
            })
        } else if (1 === arguments.length) {
            if ("boolean" === typeof arg1) {
                this.reference.setState({
                    $submitting: arg1,
                    $loading: arg1
                });
            } else {
                this.reference.setState({
                    $submitting,
                    $loading: $submitting,
                    ...arg1,
                });
            }
        } else if (2 === arguments.length) {
            this.reference.setState({
                $submitting,
                $loading: $submitting,
                ...arg1,
            });
        }
    }

    render() {
        const config = Ux.clone(this.$dialog);
        const {$visible = false, $submitting = false} = this.reference.state;
        const dialogAttrs = {};
        if (Ux.isFunction(this.$footer)) {
            const props = this.reference.props;
            dialogAttrs.$footer = this.$footer({
                ...props,
                $visible,
                $submitting,
            });
        }
        dialogAttrs.$visible = $visible;
        dialogAttrs.$submitting = $submitting;
        dialogAttrs.$dialog = config;
        return (
            <Dialog className={"web-dialog"}
                    size={"small"}
                    {...dialogAttrs}>
                {Ux.isFunction(this.$ui) ? this.$ui() : false}
            </Dialog>
        )
    }
}

/**
 * ## 页签专用类
 *
 * @class IxTab
 */
class IxTab {
    /*
     * 资源文件的具体结构
            "_tabs": {
                "defaultActiveKey": "tabForm",
                "items": "表单管理,tabForm",
                "dynamic": {
                    "tabDesign": "表单设计器"
                }
            }
     */
    constructor(reference, key = "tabs") {
        this.reference = reference;
        /* tabs 配置 */
        const tabs = Ux.fromHoc(reference, key);
        const $tabs = Ux.configTab(reference, tabs);
        if (!$tabs.hasOwnProperty('type')) {
            $tabs.type = "editable-card";
            $tabs.items[0].closable = false;    // 第一个Tab不可关闭
            $tabs.onEdit = (key, action) => {
                if ("remove" === action) {
                    this.onClose(key);
                }
            }
        }
        if (!$tabs.hasOwnProperty('hideAdd')) {
            $tabs.hideAdd = true;
        }
        $tabs.className = "ex-tabs";
        /* 动态 tabs 配置 */
        this.$tabs = $tabs;
        this.$dynamic = $tabs.dynamic;
    }

    children(uiSupplier = {}) {
        this.$uis = uiSupplier;
        return this;
    }

    render() {
        const {items = [], ...rest} = this.$tabs;
        /* 激活专用状态变量 */
        const {$activeKey} = this.reference.state;
        return (
            <Tabs {...rest} activeKey={$activeKey}>
                {items.map(item => {
                    const key = item.key;
                    const supplier = this.$uis[key];
                    return (
                        <Tabs.TabPane {...item}>
                            {Ux.isFunction(supplier) ? supplier(item) : false}
                        </Tabs.TabPane>
                    )
                })}
            </Tabs>
        );
    }

    onMount(state) {
        state.__tabs = this;
        state.$activeKey = this.$tabs.items[0].key;
        return state;
    }

    onOpen(key, data = {}) {
        const text = this.$dynamic[key];
        if (text) {
            const item = {};
            if ("string" === typeof text) {
                item.key = key;
                item.tab = text;
            } else {
                Object.assign(item, text);
            }
            this.$tabs.items.push(item);
            this.$tabs.items[0].disabled = true;
            this.reference.setState({
                $inited: data,
                $activeKey: item.key,
            })
        } else {
            console.error(`${key} 页面不存在！`, Object.keys(this.$dynamic))
        }
    }

    onClose(key) {
        if (key) {
            this.$tabs.items = this.$tabs.items.filter(item => key !== item.key);
            const $activeKey = this.$tabs.items[this.$tabs.items.length - 1].key;
            this.$tabs.items[0].disabled = false;
            this.reference.setState({
                $inited: undefined,
                $activeKey
            })
        }
    }
}

function wrapper(reference, clazz, name, callback) {
    if (callback) {
        if (Ux.isFunction(callback)) {
            /* 有名称（调用）*/
            let executor = reference.props[name];
            if (!executor) {
                const $state = reference.state ? reference.state : {};
                executor = $state[name];
            }
            if (executor) {
                callback(executor);
            }
        } else {
            console.error("传入回调函数不对！")
        }
    } else {
        return new clazz(reference);
    }
}

export default {
    /**
     * ##「组件」`Ex.uiTab`
     *
     * 构造Tab应用组件快速开发页签，为状态注入`__tabs`变量（内置）
     *
     * @memberOf module:_kernel
     * @param {ReactComponent} reference React组件引用。
     * @param {Function} consumer 构造Tab的回调函数。
     * @returns {Tab} 窗口引用
     */
    uiTab: (reference, consumer) => wrapper(reference, IxTab, "__tabs", consumer),
    /**
     * ##「组件」`Ex.uiDialog`
     *
     * 构造Dialog引用组件快速开发窗口，为状态注入`__dialog`变量（内置）
     *
     * @memberOf module:_kernel
     * @param {ReactComponent} reference React组件引用。
     * @param {Function} consumer 构造Tab的回调函数。
     * @returns {Dialog} 窗口引用
     */
    uiDialog: (reference, consumer) => wrapper(reference, IxDialog, "__dialog", consumer),
}