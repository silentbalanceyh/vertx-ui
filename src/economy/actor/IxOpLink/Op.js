import Ux from 'ux';
import Fx from '../Fx';
import {Modal} from 'antd';

const onOpen = (reference, config = {}) => (event) => {
    event.preventDefault();
    const {window} = config;
    if (window) {
        // 弹出框：批量编辑
        reference.setState({visible: true});
    } else {
        // 非弹出框：批量删除
        const {confirm = {}} = reference.state;
        Modal.confirm({
            ...confirm,
            onOk: () => {
                Fx.consume(reference, 'fnRefresh')(fnLoading => fnLoading(true))
            }
        })
    }
};
const initWindow = (state, reference) => {
    const {$options = {}, $config = {}} = reference.props;
    const literal = $options[$config.window];
    if (literal) {
        state.window = Ux.aiExprWindow(literal);
        /* 特殊配置 */
        state.window.onCancel = (event) => {
            event.preventDefault();
            reference.setState({visible: false});
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
const initConfirm = (state, reference) => {
    const {$options = {}, $config = {}} = reference.props;
    const content = $options[$config.confirm];
    state.confirm = {content};
};
const init = (reference) => {
    /* 1.窗口配置 */
    const {$config = {}} = reference.props;
    let state = reference.state;
    state = Ux.clone(state);
    if ($config.window) {
        /* 批量编辑 */
        initWindow(state, reference);
    }
    if ($config.confirm) {
        /* 带有弹出的 confirm 表单 */
        initConfirm(state, reference);
    }
    state.fnClose = () => reference.setState({visible: false});
    reference.setState(state);
};
export default {
    onOpen,
    init
};