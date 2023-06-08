import {Toolbar} from "@antv/x6-react-components";
import {Modal} from "antd";
import React from "react";

import __Zn from './zero.module.dependency';

const Cv = __Zn.Env;
/**
 * ## 「标准」`Ux.x6UiToolbar`
 * @memberOf module:x6/zero
 * @param reference
 * @param $gEvent
 * @returns {JSX.Element}
 */
const x6UiToolbar = (reference, $gEvent) => {
    const toolbar = $gEvent.uiToolbar();
    const {items = [], ...rest} = toolbar;
    rest.hoverEffect = true;
    return (
        <Toolbar {...rest}>
            {items.map((group, index) => (
                <Toolbar.Group key={`group${index}`}>
                    {group.map(item => {
                        const attrs = {};
                        attrs.key = item.name;
                        attrs.name = item.name;
                        if (item.icon) {
                            attrs.icon = __Zn.v4Icon(item.icon);
                        }
                        attrs.tooltip = item.tooltip;
                        attrs.disabled = item.disabled;
                        return (
                            <Toolbar.Item {...attrs}/>
                        );
                    })}
                </Toolbar.Group>
            ))}
        </Toolbar>
    );
}
/**
 * ## 「标准」`Ux.x6UiDialog`
 *
 * @memberOf module:x6/zero
 * @param reference
 * @param config
 * @returns {JSX.Element}
 */
const x6UiDialog = (reference, config = {}) => {
    const {
        $visible = false, $ready = false,
        $inited = {},
        $openConfig, $openId, $openComponent,
        $gEvent,
    } = reference.state;
    /*
     * 提取配置信息
     */
    const {supplier, component: Component} = config;

    const inherit = __Zn.isFunction(supplier) ? supplier(reference) : {};
    inherit.$mode = Cv.FORM_MODE.ADD;
    inherit.$inited = $inited;
    inherit.$openId = $openId;
    inherit.$gEvent = $gEvent;
    /*
     * 提取 Ui
     */
    let UI;
    if ($openComponent) {
        UI = $openComponent;
    } else {
        UI = Component;
    }
    return ($ready && $openConfig && UI) ? (
        <Modal {...$openConfig} open={$visible} onCancel={event => {
            __Zn.prevent(event);
            if ($openId) {
                // 关闭窗口
                $gEvent.winClose();

                // 调用上册方法
                const graph = $gEvent.g6Graph();
                const cell = graph.getCellById($openId);

                /**
                 * 此处调用上层方法，主要把行为变成抽象调用，不执行实际内容
                 * 而是改成调用上层的 onWindowClose 方法来执行实现，而该
                 * 方法内部仅做窗口关闭的事。
                 */
                $gEvent.onWindowClose(cell);
            }
        }}>
            <UI {...inherit}/>
        </Modal>
    ) : false
}
export default {
    x6UiToolbar,
    x6UiDialog,
}