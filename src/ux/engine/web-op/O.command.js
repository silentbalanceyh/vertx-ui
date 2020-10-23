/*
 * 专用按钮解析
 * {
 *      "key",
 *      "type",
 *      "icon",
 *      "text",
 *      "tooltip"
 * }
 * 二义性函数
 * 1）长度为 2（render流程）
 * 2）长度为 3（初始化流程）
 */
import Abs from "../../abyss";
import D from "../datum";
import R from '../../engine/expression';
import {Button, Popover, Tooltip} from "antd";
import React from "react";

function opCmdPopover() {
    const reference = arguments[0];
    if (3 <= arguments.length) {
        const events = arguments[1];
        /*
         * 第一种用法：
         * ( reference, EVENT, state )
         */
        if (Abs.isObject(events)) {
            const state = arguments[2] ? arguments[2] : {};
            const $op = {};
            Object.keys(events).forEach(key => {
                if (Abs.isFunction(events[key])) {
                    let executor = events[key](reference);
                    if (Abs.isFunction(executor)) {
                        $op[key] = executor;
                    }
                }
            });
            state.$op = $op;
            return Abs.promise(state);
        } else if ("string" === typeof events) {
            const configKey = events;
            if (configKey) {
                const config = D.fromHoc(reference, configKey);
                if (Abs.isArray(config)) {
                    const {$op = {}} = reference.state;
                    // 渲染按钮
                    const fnCommand = (item = {}) => {
                        const {tooltip, ...rest} = item;
                        const executor = $op[rest.key];
                        const attrs = Abs.clone(rest);
                        if (Abs.isFunction(executor)) {
                            attrs.onClick = executor;
                        } else {
                            attrs.onClick = (event) => {
                                Abs.prevent(event);
                                reference.setState({
                                    $popover: rest.key,     // 打开遮罩
                                    $forbidden: true,       // 屏蔽
                                })
                            }
                        }
                        // 执行按钮本身
                        const fnButton = (item) => {
                            const {text, component, ...restIn} = item;
                            const $restIn = Abs.clone(restIn);
                            /*
                             * 第四参处理状态
                             * 该状态用于判断 Command 对应的按钮启用还是禁用
                             */
                            const commandState = arguments[3];
                            if (commandState) {
                                const ret = commandState[item.key];
                                if (Abs.isFunction(ret)) {
                                    const restState = ret(reference, item);
                                    if (restState) {
                                        Object.assign($restIn, restState);
                                    }
                                } else if (Abs.isObject(ret)) {
                                    Object.assign($restIn, ret);
                                }
                            }
                            if (component) {
                                // 存在 component
                                const components = arguments[2];
                                const fnComponent = components[rest.key];
                                // 提取 popover
                                const popover = R.aiExprPopover(component.popover);
                                const {$popover} = reference.state;
                                const visible = $popover === rest.key;
                                return (
                                    <Popover {...popover} visible={visible}
                                             overlayClassName={component['popoverClass'] ? component['popoverClass'] : ""}
                                             overlayStyle={{
                                                 width: popover.width,
                                                 padding: 8,
                                             }}
                                             content={Abs.isFunction(fnComponent) ? fnComponent(reference, item) : false}>
                                        {fnButton({...$restIn, text})}
                                    </Popover>
                                );
                            } else {
                                // 提取子组件 Popover
                                if (text) {
                                    return (
                                        <Button {...$restIn}>
                                            {text}
                                        </Button>
                                    )
                                } else {
                                    return (<Button {...$restIn}/>)
                                }
                            }
                        }
                        if (tooltip) {
                            // Tooltip 优先
                            // 并且不和 $popover 冲突
                            return (
                                <Tooltip title={tooltip} key={rest.key}>
                                    {fnButton(attrs)}
                                </Tooltip>
                            )
                        } else return fnButton(attrs);
                    }
                    // 是否渲染 Button.Group
                    if (1 === config.length) {
                        const single = config[0];
                        if (Abs.isObject(single)) {
                            return fnCommand(single);
                        }
                    } else {
                        return (
                            <Button.Group>
                                {config.map(item => fnCommand(item))}
                            </Button.Group>
                        )
                    }
                } else {
                    console.error("配置错误，必须是数组配置！", config);
                }
            } else {
                console.error("第二参数不合法，请检查！", configKey);
                return false;
            }
        }
    } else {
        console.error("参数长度不合法：", arguments.length);
        return false;
    }
}

export default {
    opCmdPopover,
}