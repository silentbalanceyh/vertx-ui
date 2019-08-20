import Ux from 'ux';
import Ex from 'ex';

const yoButton = (reference) => {
    const {config = {}} = reference.props;
    let button = Ux.clone(config.button);
    if (!button.onClick) {
        button.onClick = Ex.rsVisible(reference);
    }
    return button;
};
const yoDialog = (reference) => {
    const {config = {}} = reference.props;
    const {
        $visible = false
    } = Ex.state(reference);
    const dialog = {};
    dialog.config = Ux.clone(config.dialog);
    dialog.config.visible = $visible;
    /*
     * 进入窗口内部过后才能执行
     */
    if (!dialog.config.onCancel) {
        dialog.config.onCancel = Ex.rsVisible(reference, false);
    }
    /*
     * 组件信息
     */
    dialog.component = {
        Component: config.component,    // 大写
        config: config.componentConfig,
    };
    return dialog;
};
export default {
    yoDialog,
    yoButton,
}