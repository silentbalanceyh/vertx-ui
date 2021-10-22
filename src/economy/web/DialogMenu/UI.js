import React from 'react';
import Ux from 'ux';
import Op from './Op';
import {Button} from "antd";
import Rdr from './Web';

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
const parseDialog = (reference, item = {}) => {
    let config = Ux.aiExprWindow(item.dialog);
    config = Ux.clone(config);
    config.onCancel = (event) => {
        event.preventDefault();
        reference.setState({$visible: undefined});
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
        reference.setState({$visible: undefined});
    };
    return config;
};
const parseItem = (item = {}, reference, configMap = {}) => {
    const itemConfig = {};
    // button
    const button = Ux.aiExprAction(item.button);
    if (item.children) {
        // Children Loop
        const children = [];
        item.children.forEach(child => {
            const parsed = parseItem(child, reference, configMap);
            children.push(parsed);
        });
        itemConfig.children = children;
    }
    itemConfig.button = button;
    itemConfig.key = item.key ? item.key : item.component;
    if (item.component) {
        itemConfig.component = item.component;
    }
    // dialog
    if ("DRAWER" === item.mode) {
        const dialogConfig = parseDrawer(reference, item);
        dialogConfig.mode = "DRAWER";
        itemConfig.dialog = dialogConfig;
    } else {
        const dialogConfig = parseDialog(reference, item);
        if (item.executor) {
            itemConfig.executor = item.executor;
        } else {
            dialogConfig.mode = "DIALOG";
        }
        itemConfig.dialog = dialogConfig;
    }
    // Item Prepared
    if (item.children) {
        itemConfig.button.onClick = Op.rxMenu(reference, itemConfig);
    } else {
        itemConfig.button.onClick = Op.rxClick(reference, itemConfig);
    }
    configMap[itemConfig.key] = itemConfig;
    return itemConfig;
}
const componentInit = (reference) => {
    const {config = []} = reference.props;
    const normalized = [];
    const configMap = {};
    config.forEach(each => {
        const parsed = parseItem(each, reference, configMap);
        if (parsed) {
            normalized.push(parsed)
        }
    });
    const state = {};
    state.$config = normalized;
    state.$configMap = configMap;
    state.$ready = true;
    reference.setState(state);
};

class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ux.xtRender(this, () => {
            const {$config = {}} = this.state;
            const {$disabled = []} = this.props;
            return (
                <Button.Group>
                    {$config.map(item => {
                        const $item = Ux.clone(item);
                        if ($disabled.includes(item.key)) {
                            $item.button.disabled = true;
                        }
                        if ($item.children) {
                            return Rdr.renderMenu(this, $item);
                        } else {
                            return Rdr.renderButton(this, $item);
                        }
                    })}
                    {Rdr.renderWindow(this)}
                </Button.Group>
            );
        });
    }
}

export default Component;