import __Zn from './zero.module.dependency';
import {Button, Popover, Tooltip} from "antd";

const aiAddRemove = (reference, config = {}) => {
    const {
        dataKey = "$data",
        dataMax,           // 最大数据量，达到后直接禁用添加
        indexMax,          // 添加删除的最大索引值
        index = 0          // 当前索引值
    } = config;
    if (indexMax) {
        // $indexMax must be required
        const left = {};
        left.icon = __Zn.v4Icon("plus");

        let data = reference.state[dataKey];
        data = __Zn.clone(data);

        let disabled = (index === indexMax);
        if (dataMax && !disabled) {
            disabled = data.length === dataMax;
        }
        left.disabled = disabled;

        left.onClick = (event) => {
            __Zn.prevent(event);
            data.push({key: __Zn.randomUUID()});
            const state = {};
            state[dataKey] = data;
            __Zn.of(reference).in(state).done();
            // reference.?etState(state);
        }
        const right = {};
        right.icon = __Zn.v4Icon("minus");
        right.disabled = (0 === index);
        right.onClick = (event) => {
            __Zn.prevent(event);

            data = data.filter((item, idx) => index !== idx);
            const state = {};
            state[dataKey] = data;

            __Zn.of(reference).in(state).done();
            // reference.?etState(state);
        }
        return (
            <Button.Group>
                <Button {...left}/>
                <Button {...right}/>
            </Button.Group>
        )
    } else {
        return false;
    }
}

function aiCommand() {
    const reference = arguments[0];
    if (3 <= arguments.length) {
        const events = arguments[1];
        /*
         * 第一种用法：
         * ( reference, EVENT, state )
         */
        if (__Zn.isObject(events)) {
            const state = arguments[2] ? arguments[2] : {};
            const $op = {};
            Object.keys(events).forEach(key => {
                if (__Zn.isFunction(events[key])) {
                    let executor = events[key](reference);
                    if (__Zn.isFunction(executor)) {
                        $op[key] = executor;
                    }
                }
            });
            state.$op = $op;
            return __Zn.promise(state);
        } else if ("string" === typeof events) {
            const configKey = events;
            if (configKey) {
                const config = __Zn.fromHoc(reference, configKey);
                if (__Zn.isArray(config)) {
                    const {$op = {}} = reference.state;
                    // 渲染按钮
                    const fnCommand = (item = {}) => {
                        const {tooltip, ...rest} = item;
                        const executor = $op[rest.key];
                        const attrs = __Zn.clone(rest);
                        if (__Zn.isFunction(executor)) {
                            attrs.onClick = executor;
                        } else {
                            attrs.onClick = (event) => {
                                __Zn.prevent(event);
                                __Zn.of(reference).in({
                                    $popover: rest.key,     // 打开遮罩
                                    $forbidden: true,       // 屏蔽
                                }).done();
                                // reference.?etState(state);
                                // reference.?etState({
                                //     $popover: rest.key,     // 打开遮罩
                                //     $forbidden: true,       // 屏蔽
                                // })
                            }
                        }
                        // 执行按钮本身
                        const fnButton = (item) => {
                            const {text, component, ...restIn} = item;
                            const $restIn = __Zn.clone(restIn);
                            /*
                             * 第四参处理状态
                             * 该状态用于判断 Command 对应的按钮启用还是禁用
                             */
                            const commandState = arguments[3];
                            if (commandState) {
                                const ret = commandState[item.key];
                                if (__Zn.isFunction(ret)) {
                                    const restState = ret(reference, item);
                                    if (restState) {
                                        Object.assign($restIn, restState);
                                    }
                                } else if (__Zn.isObject(ret)) {
                                    Object.assign($restIn, ret);
                                }
                            }
                            if (component) {
                                // 存在 component
                                const components = arguments[2];
                                const fnComponent = components[rest.key];
                                // 提取 popover
                                const popover = __Zn.aiExprPopover(component.popover);
                                const {$popover} = reference.state;
                                const visible = $popover === rest.key;
                                return (
                                    <Popover {...popover} open={visible}
                                             overlayClassName={component['popoverClass'] ? component['popoverClass'] : ""}
                                             overlayStyle={{
                                                 width: popover.width,
                                                 padding: 8,
                                             }}
                                             content={__Zn.isFunction(fnComponent) ? fnComponent(reference, item) : false}>
                                        {fnButton({...$restIn, text})}
                                    </Popover>
                                );
                            } else {
                                // 提取子组件 Popover
                                if (text) {
                                    $restIn.icon = __Zn.v4Icon($restIn.icon);
                                    return (
                                        <Button {...$restIn}>
                                            {text}
                                        </Button>
                                    )
                                } else {
                                    $restIn.icon = __Zn.v4Icon($restIn.icon);
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
                        if (__Zn.isObject(single)) {
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

const aiTopBar = (reference, buttons = [], disabled = {}) => {
    return (
        <Button.Group>
            {buttons.map(button => {
                const $item = __Zn.clone(button);
                /*
                 * Redux 专用处理
                 */
                const {$submitting} = reference.props;
                if ($submitting && $submitting.is()) {
                    const submitting = $submitting.to();
                    $item.loading = submitting.loading;
                } else {
                    if ("boolean" === typeof $submitting) {
                        $item.loading = $submitting;
                    }
                }
                if (disabled) {
                    if (__Zn.isObject(disabled)) {
                        if (disabled.hasOwnProperty($item.key)) {
                            $item.disabled = disabled[$item.key];
                        }
                    } else if (true === disabled) {
                        $item.disabled = disabled;
                    }
                } else {
                    $item.disabled = false;
                }
                const {text, ...rest} = $item;
                return (
                    <Button {...rest}>{text}</Button>
                )
            })}
        </Button.Group>
    )
}
export default {
    aiCommand,
    aiAddRemove,
    aiTopBar,
}