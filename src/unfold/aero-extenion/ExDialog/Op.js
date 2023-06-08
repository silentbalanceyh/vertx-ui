import Ux from "ux";

const yoButton = (reference) => {
    const {config = {}} = reference.props;
    let button = Ux.clone(config.button);
    if (!button.onClick && !button.disabled) {
        // Ex.r?Visible(reference);
        button.onClick = (event) => {
            Ux.prevent(event);
            Ux.of(reference).open().done();
            const {dialog = {}} = config;
            if ("POPOVER" === dialog.type) {
                const {rxPop} = reference.props;
                if (Ux.isFunction(rxPop)) {
                    rxPop();
                }
            }
        }
    }
    return button;
};
const yoDialog = (reference) => {
    const {config = {}} = reference.props;
    const {
        $visible = false
    } = reference.state;
    const dialog = {};
    dialog.config = Ux.clone(config.dialog);
    // v4
    dialog.config.open = $visible;
    /*
     * 进入窗口内部过后才能执行
     */
    if (!dialog.config.onCancel) {
        // Ex.r?Visible(reference, false);
        dialog.config.onCancel = (event) => {
            const addOn = Ux.prevent(event);
            Ux.of(reference).in(addOn).hide().done()
        }
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