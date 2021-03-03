import React from 'react';
import {Button} from 'antd';
import Ux from 'ux';
import Jsx from "./Web";


/**
 * ## 「组件」`DialogButton`
 *
 * ```js
 * import { DialogButton } from 'web';
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
 * |children||props|Jsx|React级别的子组件。|
 * |$content||props|Jsx|传入的子组件，该子组件优先级低于children。|
 * |$hidden||props|Boolean|是否隐藏当前按钮，如果为true则隐藏按钮。|
 * |$mode||props|String|设置三种模式：`DIALOG | DRAWER | POPOVER`。|
 * |$button||props|String/Object|调用`aiExprAction`解析该配置生成按钮专用配置。|
 * |$dialog||props|Object|不同窗口模式使用不同配置完成。|
 * |$loading||props|Boolean|是否处于提交/加载状态。|
 * |rxClick||props|Function|按钮点击的回调函数，在点击按钮设置visible=true过后执行该回调。|
 * |rxOk||props|Function|优先考虑使用外层rxOk执行该函数，如果是String则直接触发`Ux.connectId`操作。|
 * |button||state|Object|存储在当前组件的按钮配置。|
 * |dialog||state|Object|存储在当前组件的窗口配置。|
 * |visible||state|Boolean|显示/隐藏窗口专用配置。|
 * |render||state|Function|专用Jsx的渲染函数。|
 *
 * ### 3. 组件核心点
 *
 * #### 3.1. 关于子组件的计算
 *
 * 1. 过滤掉的属性表：
 *      * `$disabled`
 *      * `$button`
 *      * `$dialog`
 *      * `$mode`
 *      * `$inited`
 *      * `$content`
 * 2. 其他属性再追加`rxClose`专用方法关闭窗口进行继承。
 * 3. 内置窗口使用`Dialog`组件替换原生的`<Modal/>`操作，来完成状态注入。
 *
 * #### 3.2. 模式解析
 *
 * `$mode`设置的值生成三种不同的窗口：
 *
 * * DIALOG：弹出窗口组件`<Modal/>`。
 * * DRAWER：抽屉窗口组件`<Drawer/>`。
 * * POPOVER：浮游窗口组件`<Popover/>`。
 *
 * #### 3.3. 状态说明
 *
 * * `$loading`：组件是否处于加载状态，当前按钮的加载状态等价于提交状态，这个值会传递给子组件。
 * * `visible`：用于记录当前组件的现实和隐藏的专用属性，注意这个属性和Zero Ui规范中的`$visible`有一定区别，原因是这个组件是旧组件，历史太长，暂时没做更改。
 *
 * @memberOf module:web-component
 * @method * DialogButton
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const parseButton = (reference) => {
    const {$button = {}, rxClick} = reference.props;
    const config = Ux.aiExprAction($button);
    config.onClick = (config = {}) => (event) => {
        Ux.prevent(event);
        // 打开窗口
        reference.setState({visible: true});
        if (Ux.isFunction(rxClick)) {
            rxClick({config});
        }
    };
    return config;
};
const parseDialog = (reference) => {
    const {$dialog = {}, rxOk} = reference.props;
    let config = Ux.aiExprWindow($dialog);
    // 拷贝配置
    config = Ux.clone(config);
    config.onCancel = (event) => {
        event.preventDefault();
        reference.setState({visible: false});
    };
    if (!config.hasOwnProperty('onOk') && Ux.isFunction(rxOk)) {
        config.onOk = rxOk;
    }
    // 抽取连接点，直接转换成属性，就不会被config.onOk影响了
    const id = config.onOk;
    if (!Ux.isFunction(id)) {
        config.onOk = () => Ux.connectId(id);
    }
    return config;
};
const parseDrawer = (reference) => {
    const {$dialog = {}} = reference.props;
    let config = Ux.aiExprDrawer($dialog);
    // 拷贝配置
    config = Ux.clone(config);
    config.onClose = (event) => {
        event.preventDefault();
        reference.setState({visible: false});
    };
    return config;
};
const parsePopover = (reference) => {
    const {$dialog = {}} = reference.props;
    let config = Ux.aiExprPopover($dialog);
    config = Ux.clone(config);
    config.onClose = (event) => {
        event.preventDefault();
        reference.setState({visible: false});
    };
    return config;
};
const configuration = {
    DIALOG: parseDialog,
    DRAWER: parseDrawer,
    POPOVER: parsePopover,
};
const componentInit = (reference) => {
    // 1.判断当前组件是哪种Button，使用了哪种Dialog
    const {$mode, $hidden = false} = reference.props;
    // 2.按钮处理
    const button = parseButton(reference);
    // 3.Window的解析不一致
    const executor = configuration[$mode];
    const render = Jsx[$mode];
    let state = {};
    if (Ux.isFunction(executor) && Ux.isFunction(render)) {
        // 5.窗口配置处理
        const dialog = executor(reference);
        // 6.处理模式
        if ($hidden) {
            button.className = "ux-hidden";
            button.id = button.key;
        }
        state = {
            button, dialog,
            visible: false, render
        }
    } else {
        // Error
        state = {error: Ux.E.fxError(10092, $mode)};
    }
    reference.setState(state);
};

class Component extends React.PureComponent {

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ux.xtRender(this, () => {
            const {
                button = {},
                render
            } = this.state;
            // 按钮专用处理
            const {text, onClick, ...rest} = button;
            // 是否禁用
            const {$disabled = false} = this.props;
            const attrs = {disabled: $disabled};
            return (
                <span>
                    <Button {...rest} onClick={onClick(button)} {...attrs}>
                        {text ? text : ""}
                    </Button>
                    {render(this)}
                </span>
            );
        });
    }
}

export default Component;