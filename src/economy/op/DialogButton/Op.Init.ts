import Ux from "ux";
import * as U from 'underscore';
import Renders from './UI.Render';

const parseButton = (reference) => {
    const {$button = {}, rxClick} = reference.props;
    const config = Ux.aiExprAction($button);
    config.onClick = (config = {}) => (event) => {
        // 二义性处理
        const args: any = {config};
        if (U.isFunction(event.preventDefault)) {
            event.preventDefault();
        } else {
            args.data = event;
        }
        reference.setState({visible: true});
        if (U.isFunction(rxClick)) {
            rxClick(args);
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
    const {$mode} = reference.props;
    // 2.提取模式
    // DIALOG, DRAWER, POPOVER
    const modeDialog = $mode;
    // 3.模式处理
    const button = parseButton(reference);
    // 4.Window的解析不一致
    const executor = configuration[modeDialog];
    const render = Renders[modeDialog];
    if (U.isFunction(executor) && U.isFunction(render)) {
        // 5.窗口配置处理
        const dialog = executor(reference);
        // 6.处理模式
        return {
            button, dialog,
            visible: false, render
        }
    } else {
        // Error
        return {error: Ux.E.fxMessageError(10092, modeDialog)};
    }
};
export default {
    initState
}