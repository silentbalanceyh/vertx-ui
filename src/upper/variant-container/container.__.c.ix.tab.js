import Ux from 'ux';
import React from "react";
import {Tabs} from "antd";

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
        const $items = Ux.v4Items(items, {
            // itemFn: 默认
            childFn: (item = {}) => {
                const key = item.key;
                const supplier = this.$uis[key];
                return Ux.isFunction(supplier) ? supplier(item) : false;
            }
        });
        /*
                {items.map(item => {
                    const key = item.key;
                    const supplier = this.$uis[key];
                    return (
                        <Tabs.?abPane {...item}>
                            {Ux.isFunction(supplier) ? supplier(item) : false}
                        </Tabs.?abPane>
                    )
                })}
         */
        return (
            <Tabs {...rest} activeKey={$activeKey} items={$items}/>
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
            Ux.of(this.reference).in({
                $inited: data,
                $activeKey: item.key,
            }).done();
            // this.reference.?etState({
            //     $inited: data,
            //     $activeKey: item.key,
            // })
        } else {
            console.error(`${key} 页面不存在！`, Object.keys(this.$dynamic))
        }
    }

    onClose(key) {
        if (key) {
            this.$tabs.items = this.$tabs.items.filter(item => key !== item.key);
            const $activeKey = this.$tabs.items[this.$tabs.items.length - 1].key;
            this.$tabs.items[0].disabled = false;
            Ux.of(this.reference).in({
                $inited: undefined,
                $activeKey
            }).done();
            // this.reference.?etState({
            //     $inited: undefined,
            //     $activeKey
            // })
        }
    }
}

export default IxTab;