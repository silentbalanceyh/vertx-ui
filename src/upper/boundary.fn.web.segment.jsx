import Ux from 'ux';
import React from 'react';
import {Button, Menu} from 'antd';

export default {
    // web系列方法专用
    /*
     * 「组件外层」
     * webAction 渲染，每一页右上角的按钮处理
     * event should be mapped to configured id and Ux.connectId instead.
     * --------> 「Input」
     * reference state
     * {
     *     $activeKey,
     *     $refresh,
     *     $loading
     * }
     * 「Output」---------> <Button/> ( 1 or N )
     */
    webAction: (reference, configuration = {} /* webAction */) => {
        if (!configuration) {
            // 什么都不渲染
            console.warn("配置有问题，不渲染", configuration);
            return false;
        }
        const {
            $activeKey,
            $refresh,
            $loading = false
        } = reference.state;
        return (
            <div>
                {Ux.ambArray(configuration).map((action = {}, index) => {
                    const {text, connectId, ...rest} = action;
                    const attrs = Ux.clone(rest);
                    /* 禁用条件：$refresh 无值 */
                    attrs.disabled = !$refresh;
                    attrs.loading = $loading;
                    if (!attrs.key) {
                        attrs.key = `${$activeKey}-action-${index}`;
                    }
                    attrs.onClick = (event) => {
                        Ux.prevent(event);
                        Ux.connectId(connectId);
                    };
                    attrs.icon = Ux.v4Icon(rest.icon);
                    return (
                        <Button {...attrs}>
                            {text}
                        </Button>
                    )
                })}
            </div>
        )
    },
    /*
     * Connect to webAction here, but 「组件内层」
     * -------->「Input」
     * reference props
     * {
     *     $region: "Single Region",
     *     $loading: "$loading of parent reference.state"
     * }
     * actionFn: Must be secondary fn () => () => {}, the system will build
     * action execution operation by actionFn(reference) and assign to action
     * Output also be <Button/>
     */
    webAnchor: (reference, actionFn = []) => {
        const {
            $anchors = [],
            $loading = false,
        } = reference.props;
        return actionFn.map((action, index) => {
            const id = $anchors[index];
            if (id && Ux.isFunction(action)) {
                const attrs = {};
                attrs.id = id;
                attrs.key = id;                 // Each child in a list should have a unique `key` prop
                attrs.className = 'ux_hidden';
                attrs.loading = $loading;
                attrs.onClick = action(reference);      // Dim 2 function
                return (
                    <Button {...attrs}/>
                )
            } else {
                // Nothing to render
                return false;
            }
        })
    },
    /*
     * Group's group / build different usage data here.
     * config -> group should contain data
     */
    webTag: (reference, configuration = {} /* webTag */, actionFn = {}) => {
        const {
            config = {},
            ui = {},
        } = configuration;
        // <Select/>
        const {$gData = [], $selected} = reference.state;
        const {
            field,
            source,
            value,
            display,
        } = config;
        const values = $gData.map(item => item[field])
            .reduce((pre, cur) => pre.includes(cur) ? pre : pre.concat(cur), []);
        const sData = Ux.onDatum(reference, source)
            .filter(item => values.includes(item[value]));
        // <Select/>
        const {
            rxTag = () => false,
            rxSelect,
        } = actionFn;

        const attrs = Ux.clone(ui);
        attrs.mode = "inline";      // to avoid overwrite mode here
        attrs.inlineIndent = 24;
        if (Ux.isFunction(rxSelect)) {
            attrs.onSelect = rxSelect(reference);
        }
        if ($selected) {
            attrs.selectedKeys = [$selected.key];
        }
        // eslint-disable-next-line array-callback-return
        const items = sData.map(dataG => {
            const item = {};
            item.key = dataG.key;
            item.label = (
                <span>
                    {Ux.v4Icon("code-sandbox")}
                    <span>{dataG[display]}</span>
                </span>
            )
            item.children = rxTag(reference, {
                // dm/ui arch
                dm: dataG,
                ui: $gData.filter(item => dataG[value] === item[field])
            });
            return item;
        })
        return (
            <Menu {...attrs} items={items}/>
        );
    }
}