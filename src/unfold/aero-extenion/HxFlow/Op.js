import React from 'react';
import Ux from 'ux';
import __Zn from '../zero.aero.dependency';
import {ClockCircleOutlined} from "@ant-design/icons";

const cacheFlow = (reference, value) => {
    const {$flow = {}} = reference.state ? reference.state : {};
    if ($flow.hasOwnProperty(value)) {
        return Ux.promise($flow[value]);
    } else {
        return Ux.ajaxGet("/api/up/flow-definition/:value", {value});
    }
}

const doSelected = (reference, input = {}) => {
    const {item = {}} = input;
    const {data = {}} = item.props;
    Ux.of(reference).loading(false).handle(() => {
        const state = {};
        // Flow Definition Processing
        cacheFlow(reference, data.value).then(flow => {
            state.$loading = false;
            const selected = Ux.clone(data);
            const {uiConfig = {}} = flow;
            /*
             * Graphic configuration
             * 1. bpmn -> graphic for workflow
             * 2. uiConfig for workflow chat size
             */
            selected.bpmn = flow.bpmn;
            {
                // Cache
                let {$flow = {}} = reference.state ? reference.state : {};
                $flow = Ux.clone($flow);
                $flow[data.value] = flow;
                state.$flow = $flow;
            }
            selected.uiConfig = uiConfig;
            state.$selected = selected;
            state.$keyChild = undefined;

            Ux.of(reference).in(state).handle(() => {

                Ux.fn(reference).rxFlag(false);
            })
            // reference.?etState(state);

            // Ux.fn(reference).rxFlag(false);
        })
    })
    // reference.?etState({$loading: true});       // Loading Data from Remote
    // const state = {};
    // // Flow Definition Processing
    // cacheFlow(reference, data.value).then(flow => {
    //     state.$loading = false;
    //     const selected = Ux.clone(data);
    //     const {uiConfig = {}} = flow;
    //     /*
    //      * Graphic configuration
    //      * 1. bpmn -> graphic for workflow
    //      * 2. uiConfig for workflow chat size
    //      */
    //     selected.bpmn = flow.bpmn;
    //     {
    //         // Cache
    //         let {$flow = {}} = reference.state ? reference.state : {};
    //         $flow = Ux.clone($flow);
    //         $flow[data.value] = flow;
    //         state.$flow = $flow;
    //     }
    //     selected.uiConfig = uiConfig;
    //     state.$selected = selected;
    //     state.$keyChild = undefined;
    //     reference.?etState(state);
    //
    //     Ux.fn(reference).rxFlag(false);
    // })
}

export default {
    /*
     * config -> webTag 提取加载过滤器
     */
    jsxTag: (reference, input = {}) => {
        const {ui = []} = input;
        return ui.map(each => {
            const uiItem = {};
            uiItem.key = each.key;
            uiItem.data = each;
            uiItem.value = each.value;
            uiItem.label = each.label;
            uiItem.icon = <ClockCircleOutlined/>
            return uiItem;
            /*
             (
            <Menu.Item key={each.key} value={each.value}
                       data={each}>
                {Ux.v4Icon("clock-circle")}
                {each.label}
            </Menu.Item>
        )
             */
        });
    },
    /*
     * Returned:
     * {
     *    UI,
     *    inherit
     * }
     */
    yoChild: (reference, child = {}, $selected = {}, HI = {}) => {
        const {
            component
        } = child;
        const UI = HI[component];
        const childConfig = __Zn.aclChild(reference, child, $selected);
        if (childConfig && UI) {
            const inherit = __Zn.yoAmbient(reference);
            Object.assign(inherit, childConfig);
            // Following configuration belong to HxFlow only
            // 画布
            const $config = inherit.config;
            const {uiConfig = {}} = $selected;
            $config.webCanvas = uiConfig.canvas;
            inherit.config = $config;
            // 流程图 + Workflow Definition
            inherit.$bpmn = $selected.bpmn;
            inherit.$workflow = $selected;
            return {
                UI,
                inherit,
                container: childConfig.$container
            }
        }
    },
    rxSelect: (reference) => (input = {}) => {
        // $keyChild === undefined
        const {$keyChild} = reference.state;
        if ($keyChild) {
            Ux.fn(reference).rxSwitch(() => doSelected(reference, input));
        } else {
            doSelected(reference, input);
        }
    }
}