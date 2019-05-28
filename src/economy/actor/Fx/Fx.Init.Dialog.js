import Ux from 'ux';

const initWindow = (state, reference) => {
    const {$options = {}, $config = {}} = reference.props;
    const literal = $options[$config.window];
    if (literal) {
        state.window = Ux.aiExprWindow(literal);
        /* 特殊配置 */
        state.window.onCancel = (event) => {
            event.preventDefault();
            reference.setState({$visible: false});
        };
        /* 窗口专用配置 */
        state.window.destroyOnClose = true;
        state.window.maskClosable = false;
        const onOk = state.window.onOk;
        if ("string" === typeof onOk) {
            state.window.onOk = () => Ux.connectId(onOk);
        }
    }
};
const initPopover = (state, reference) => {
    const {$options = {}, $config = {}} = reference.props;
    const literal = $options[$config.popover];
    if (literal) {
        state.popover = Ux.aiExprPopover(literal);
    }
};
const initConfirm = (state, reference) => {
    const {$options = {}, $config = {}} = reference.props;
    const content = $options[$config.confirm];
    state.confirm = {content};
};
const init = (reference = {}) => {
    /* 1. 窗口配置提取 */
    const {$config = {}} = reference.props;
    let state = reference.state ? reference.state : {};
    state = Ux.clone(state);
    /* 2. 容器配置 */
    if ($config.window) {
        /* 2.1. 弹出框配置 */
        initWindow(state, reference);
    } else if ($config.confirm) {
        /* 2.2. 带有 confirm 提示 */
        initConfirm(state, reference);
    } else if ($config.popover) {
        /* 2.3. 浮游框配置 */
        initPopover(state, reference);
    }
    /* 3. 统一函数 */
    state.fnClose = () => reference.setState({$visible: false});
    state.fnSubmit = ($loading = true) => reference.setState({$loading});
    reference.setState(state);
};
export default {
    init
};