import React from 'react';
import Op from './Op';
import {Tabs} from 'antd';

import __Zn from '../zero.uca.dependency';
import FormContainer from '../FormContainer/UI';
import "./Cab.norm.scss";
import Sk from 'skin';
import Ext from './UI.Extra';

const componentInit = (reference) => {
    const {
        config = {},
        children,
        $metadata = {}
    } = reference.props;
    if (children) {
        __Zn.of(reference).in({
            error: "Not Allow `children` in current component."
        }).done();
        // reference.?etState({error: "Not Allow `children` in current component."})
    } else {
        /*
         * 子表单渲染
         */
        const {
            pages = {},
            type = "card",
            size = "default",
        } = config;
        const raft = {};
        /*
         * 这里调用了 onReference 方法，完美处理了连接问题
         * 保证此处的子组件直接穿透带有 form 的 reference.props
         */
        const ref = __Zn.onReference(reference, 1);   // 读取带有 Form 的引用
        const keys = Object.keys(pages);
        const promises = keys.map(activeKey => pages[activeKey])
            .map(form => __Zn.capForm(ref, {form}));
        const {$renders = {}} = reference.props;
        __Zn.parallel.apply(null, [promises].concat(keys)).then(response => {
            Object.freeze(response);
            /*
             * 多个Form的处理
             */
            __Zn.itObject(response, (activeKey, raftConfig = {}) => {
                const {form, addOn = {}} = raftConfig;
                raft[activeKey] = __Zn.configForm(form, {
                    ...addOn, renders: $renders,
                    metadata: $metadata,
                }, __Zn.bindContainer(CONTAINER));
            });
            /*
             * pages 解析完成过后处理 $tabs
             */
            const state = {};
            const $tabs = __Zn.configTab(reference, __Zn.yoLimit(config, [
                "pages"
            ]));
            if ($tabs.hasOwnProperty('activeKey')) {
                /*
                 * 有状态的 activeKey 优先
                 */
                state.$activeKey = $tabs.activeKey;
            } else {
                if ($tabs.hasOwnProperty("defaultActiveKey")) {
                    /*
                     * 无状态转换成有状态
                     * defaultActiveKey 转换成 $activeKey
                     */
                    state.$activeKey = $tabs.defaultActiveKey;
                }
            }
            $tabs.type = type;
            $tabs.size = size;
            {
                /*
                 * items 过滤，执行上层传入的 koTab 函数
                 */
                let $items = __Zn.clone($tabs.items);
                const {koTab = () => $items} = reference.props;
                $items.forEach(item => item.forceRender = true);
                $tabs.items = koTab($items);
            }
            $tabs.items.forEach(item => {
                const raftItem = raft[item.key];
                /*
                 * 延迟处理
                 */
                item.fnChild = (values = {}) => __Zn.aiField(ref, values, raftItem);
            });
            /*
             * readOnly 删除 tabBarExtraContent
             */
            const attrs = Sk.mixUca("FieldContainer", null, {
                className: $tabs.className
            });
            Object.assign($tabs, attrs);
            // Extra Extension
            Ext.yiExtra($tabs, reference);
            state.$tabs = $tabs;
            __Zn.of(reference).in(state).ready().done();
            // reference.?etState(state);
            // state.$ready = true;
        }).catch(error => console.error(error));
    }
};

class Component extends React.PureComponent {
    state = {};

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return __Zn.xtReady(this, () => {
            const {$tabs = {}, $activeKey} = this.state;
            const tabs = Op.yoExtra($tabs, this);
            const {items = [], ...rest} = tabs;
            const {$inited = {}} = this.props;
            // v4
            const $items = __Zn.v4Items(items, {
                // childFn
                childFn: (item) => {
                    const {fnChild} = item;
                    return __Zn.isFunction(fnChild) ? fnChild($inited) : false;
                }
            }, this);
            /*
                    {items.map(item => {
                        const {fnChild, ...rest} = item;
                        return (
                            <Tabs.?abPane {...rest}>
                                {__Zn.isFunction(fnChild) ? fnChild($inited) : false}
                            </Tabs.?abPane>
                        )
                    })}
             */
            return (
                <Tabs {...rest} activeKey={$activeKey} items={$items}/>
            );
        })
    }
}

const CONTAINER = {
    FieldContainer: Component,
    FormContainer,
}

export default Component;