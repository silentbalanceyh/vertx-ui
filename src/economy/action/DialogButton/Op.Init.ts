import Ux from "ux";
import * as U from 'underscore';
import Renders from './UI.Render';

const parseButton = (reference) => {
    const {$button = {}, rxClick} = reference.props;
    const config = Ux.aiExprAction($button);
    config.onClick = (config = {}) => (event) => {
        // 二义性处理
        if (U.isFunction(event.preventDefault)) {
            event.preventDefault();
        }
        reference.setState({visible: true});
        if (U.isFunction(rxClick)) {
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
    if (!config.hasOwnProperty('onOk') && U.isFunction(rxOk)) {
        config.onOk = rxOk;
    }
    // 抽取连接点，直接转换成属性，就不会被config.onOk影响了
    const id = config.onOk;
    if (!U.isFunction(id)) {
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
const initState = (reference) => {
    // 1.判断当前组件是哪种Button，使用了哪种Dialog
    const {$mode, $hidden = false} = reference.props;
    // 2.按钮处理
    const button = parseButton(reference);
    // 3.Window的解析不一致
    const executor = configuration[$mode];
    const render = Renders[$mode];
    if (U.isFunction(executor) && U.isFunction(render)) {
        // 5.窗口配置处理
        const dialog = executor(reference);
        // 6.处理模式
        if ($hidden) {
            button.className = "ux-hidden";
            button.id = button.key;
        }
        return {
            button, dialog,
            visible: false, render
        }
    } else {
        // Error
        return {error: Ux.E.fxError(10092, $mode)};
    }
};
export default {
    initState
}