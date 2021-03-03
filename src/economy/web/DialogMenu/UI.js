import React from 'react';
import Ux from 'ux';
import {Button, Dropdown, Icon, Menu} from 'antd';
import Op from "./Op";
import Jsx from "./Web";

/**
 * ## 「组件」`DialogMenu`
 *
 * ```js
 * import { DialogMenu } from 'web';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * ### 2. 属性说明
 *
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |$mode||props|String|设置窗口模式：`DIALOG | DRAWER`，该组件不支持浮游窗口。|
 * |$items||props|Array|菜单项相关配置。|
 * |$button||props|String/Object|调用`aiExprAction`解析该配置生成按钮专用配置。|
 * |$content||props|Object|不同菜单渲染的组件对象，上层传入外置对象。|
 * |$inited||props|Object|初始化表单值信息。|
 * |$loading||props|Boolean|是否处于提交/加载状态。|
 * |$functions||props|Object|执行CONFIRM时的回调函数，用于处理回调信息。|
 * |button||state|Object|主按钮配置信息。|
 * |items||state|Array|菜单项专用配置。|
 * |renders||state|Object|生成的子组件渲染器。|
 * |visible||state|Object|`key`=true/false，记录每个菜单项组件的显示/隐藏。|
 * |windows||state|Object|`key`=配置，记录每个窗口的配置信息。|
 *
 * ### 3. 组件核心点
 *
 * #### 3.1. 单个选项结构
 *
 * ```json
 * {
 *     "button": "按钮配置",
 *     "dialog": "窗口配置",
 *     "component": "使用的组件key，对应$content变量",
 *     "confirm": "删除专用，带有浮游提示窗口（是否）",
 *     "init": "布尔值，是否给子组件传入初始化数据信息。"
 * }
 * ```
 *
 * #### 3.2. 三种执行器
 *
 * * DIRECT：直接执行函数的执行器。
 * * DIALOG：窗口执行器，设置显示/隐藏专用执行器。
 * * CONFIRM：直接应用`Modal.confirm`的执行器。
 *
 * #### 3.3. 初始化数据渲染器
 *
 * 1. 先从props中读取`$inited`变量作为表单初始化变量。
 * 2. 判断`init`的值，过滤
 *      * `$disabled`
 *      * `$disabledItems`
 *      * `$inited`
 *      * `$items`
 *      * `$button`
 *      * `$functions`
 *      * `$content`
 *      * `$mode`
 * 3. 为`$inited`和`$parent`赋值
 *      * 带`_`前缀的字段直接放到`$inited`中。
 *      * $parent中存储的就是$inited数据。
 * 4. 追加`rxClose`专用方法进入子组件。
 *
 *
 * #### 3.4. 状态说明
 *
 * * `$loading`：组件是否处于加载状态，当前按钮的加载状态等价于提交状态，这个值会传递给子组件。
 * * `visible`：此处是一个Object类型，记录了每个组件的显示和隐藏状态。
 *
 * @memberOf module:web-component
 * @method * DialogMenu
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const parseButton = (reference) => {
    const {$button = {}} = reference.props;
    const config = Ux.aiExprAction($button);
    config.onClick = Op.onClick(reference);
    return config;
};
const parseDialog = (reference, item = {}) => {
    let config = Ux.aiExprWindow(item.dialog);
    config = Ux.clone(config);
    config.onCancel = (event) => {
        event.preventDefault();
        let state = Ux.clone(reference.state);
        state.visible[item.key] = false;
        reference.setState(state);
    };
    const id = config.onOk;
    if (!Ux.isFunction(id)) {
        config.onOk = () => Ux.connectId(id);
    }
    return config;
};
const parseDrawer = (reference, item) => {
    let config = Ux.aiExprDrawer(item.dialog);
    config.onClose = (event) => {
        event.preventDefault();
        let state = Ux.clone(reference.state);
        state.visible[item.key] = false;
        reference.setState(state);
    };
    return config;
};
const configuration = {
    // 菜单由于Popover的冲突，不提供Popover的模式
    DIALOG: parseDialog,
    DRAWER: parseDrawer
};
const componentInit = (reference) => {
    // 1.判断当前组件是哪种Button，使用了哪种Dialog
    const {$mode, $items = []} = reference.props;
    let itemsConfig = Ux.clone($items);
    // 2.按钮处理
    const button = parseButton(reference);
    // 3.Window的解析函数不一致
    if (0 < $items.length && ("DIALOG" === $mode || "DRAWER" === $mode)) {
        const items = [];
        const renders = {};
        const windows = {};
        const visible = {};
        itemsConfig.forEach(item => {
            // 解析对应的菜单项
            item.button = Ux.aiExprAction(item.button);
            // item中button的key赋值
            item.key = item.button.key;
            if (item.hasOwnProperty("dialog")) {
                // 使用executor解析窗口
                const executor = configuration[$mode];
                item.dialog = executor(reference, item);
                item.type = "DIALOG";
                renders[item.key] = Jsx.renderItem(reference, item);
                windows[item.key] = Jsx[$mode](reference, item);
                visible[item.key] = false;
            } else if (item.hasOwnProperty("confirm")) {
                // 删除专用模式
                item.type = "CONFIRM";
                if ("string" === typeof item.confirm) {
                    const formatted = item.confirm.split(",");
                    const confirm = {};
                    confirm.content = formatted[0];
                    if (formatted[1]) confirm.okText = formatted[1];
                    if (formatted[2]) confirm.cancelText = formatted[2];
                    item.confirm = confirm;
                }
                renders[item.key] = Jsx.renderItem(reference, item);
            } else {
                item.type = "DIRECT";
            }
            items.push(item);
        });
        return {
            button, items,
            // 渲染
            renders,
            // 呈现，DIALOG专用
            visible, windows
        }
    } else {
        // Error
        if (0 === $items.length) {
            return {error: Ux.E.fxError(10094, $items.length)};
        }
        return {error: Ux.E.fxError(10093, $mode)};
    }
};

class Component extends React.PureComponent {
    render() {
        const reference = this;
        return Ux.xtRender(this, () => {
            const {
                button = {}, items = [],
                renders = {}, windows = {},
            } = reference.state;
            button.icon = "down";
            const {text, icon, onClick, ...rest} = button;
            // 是否禁用
            const {$disabled = false, $disabledItems = {}} = this.props;
            const attrs = {disabled: $disabled};
            return (
                <span>
                    <Dropdown overlay={
                        <Menu onClick={onClick} key={Ux.randomUUID()}>
                            {items.filter(item => Ux.isFunction(renders[item.key]))
                                .map(item => (
                                    <Menu.Item key={item.key}
                                               disabled={$disabledItems[item.key]}>
                                        {renders[item.key]()}
                                    </Menu.Item>
                                ))}
                        </Menu>
                    } {...attrs}>
                        <Button {...rest}>
                            {text ? text : ""}&nbsp;<Icon type={icon}/>
                        </Button>
                    </Dropdown>
                    {items.filter(item => windows.hasOwnProperty(item.key))
                        .filter(item => Ux.isFunction(windows[item.key]))
                        .map(item => windows[item.key]())}
                </span>
            );
        });
    };

    componentDidMount() {
        componentInit(this);
    }
}

export default Component;