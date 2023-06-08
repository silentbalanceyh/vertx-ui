import React from 'react';
import {Button} from 'antd';
import Jsx from "./Web";
import __Zn from '../zero.uca.dependency';


// =====================================================
// componentInit/componentUp
// =====================================================
const parseButton = (reference) => {
    const {$button = {}, rxClick} = reference.props;
    const config = __Zn.aiExprAction($button);
    config.onClick = (config = {}) => (event) => {
        __Zn.prevent(event);
        // 打开窗口
        __Zn.of(reference).open().handle(() => {

            if (__Zn.isFunction(rxClick)) {
                rxClick({config});
            }
        })
        // reference.?etState({visible: true});
        // if (__Zn.isFunction(rxClick)) {
        //     rxClick({config});
        // }
    };
    return config;
};
const parseDialog = (reference) => {
    const {$dialog = {}, rxOk} = reference.props;
    let config = __Zn.aiExprWindow($dialog);
    // 拷贝配置
    config = __Zn.clone(config);
    config.onCancel = (event) => {
        event.preventDefault();
        __Zn.of(reference).hide().done();
        // reference.?etState({visible: false});
    };
    if (!config.hasOwnProperty('onOk') && __Zn.isFunction(rxOk)) {
        config.onOk = rxOk;
    }
    // 抽取连接点，直接转换成属性，就不会被config.onOk影响了
    const id = config.onOk;
    if (!__Zn.isFunction(id)) {
        config.onOk = () => __Zn.connectId(id);
    }
    return config;
};
const parseDrawer = (reference) => {
    const {$dialog = {}} = reference.props;
    let config = __Zn.aiExprDrawer($dialog);
    // 拷贝配置
    config = __Zn.clone(config);
    config.onClose = (event) => {
        event.preventDefault();

        __Zn.of(reference).hide().done();
        // reference.?etState({visible: false});
    };
    return config;
};
const parsePopover = (reference) => {
    const {$dialog = {}} = reference.props;
    let config = __Zn.aiExprPopover($dialog);
    config = __Zn.clone(config);
    config.onClose = (event) => {
        event.preventDefault();

        __Zn.of(reference).hide().done();
        // reference.?etState({visible: false});
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
    if (__Zn.isFunction(executor) && __Zn.isFunction(render)) {
        // 5.窗口配置处理
        const dialog = executor(reference);
        // 6.处理模式
        if ($hidden) {
            button.className = "ux_hidden";
            button.id = button.key;
        }
        state = {
            button, dialog,
            visible: false, render
        }
    } else {
        // Error
        state = {error: __Zn.E.fxError(10092, $mode)};
    }
    __Zn.of(reference).in(state).done();
    // reference.?etState(state);
};

class Component extends React.PureComponent {

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return __Zn.xtRender(this, () => {
            const {
                button = {},
                render
            } = this.state;
            // 按钮专用处理
            const {text, onClick, ...rest} = button;
            // 是否禁用
            const {$disabled = false} = this.props;
            const attrs = {disabled: $disabled};
            if (rest.icon) {
                rest.icon = __Zn.v4Icon(rest.icon);
            }
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