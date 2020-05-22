import Ux from 'ux';
import {Tabs} from 'antd';
import React from 'react';

class Component {
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

export default Component;