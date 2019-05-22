import Ux from 'ux';

const onOpen = (reference, config = {}) => (event) => {
    event.preventDefault();
    const {window} = config;
    if (window) {
        // 弹出框：批量编辑
        reference.setState({visible: true});
    } else {
        // 非弹出框：批量删除
    }
};
const init = (reference) => {
    /* 1.窗口配置 */
    const {$config = {}, $options = {}} = reference.props;
    let state = reference.state;
    state = Ux.clone(state);
    if ($config.window) {
        const literal = $options[$config.window];
        if (literal) {
            state.window = Ux.aiExprWindow(literal);
            /* 特殊配置 */
            state.window.onCancel = (event) => {
                event.preventDefault();
                reference.setState({visible: false});
            };
            /* */
            state.window.destroyOnClose = true;
            state.window.maskClosable = false;
            const onOk = state.window.onOk;
            if ("string" === typeof onOk) {
                state.window.onOk = () => Ux.connectId(onOk);
            }
        }
    }
    state.fnClose = () => reference.setState({visible: false});
    reference.setState(state);
};
export default {
    onOpen,
    init
}