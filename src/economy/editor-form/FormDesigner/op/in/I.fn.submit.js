import Ux from 'ux';
/*
 * 反向赋值
 */
const dataSubmit = (normalized = {}, extension = {}, actions = {}, flag) => {
    /* 第一提交，第二提交 */
    const v = flag ? flag : "";

    /*
     * 客户端部分
     */
    let id;
    if (extension.id) {
        id = extension.id.replace('$', '');
    }
    normalized[`client${v}Id`] = id;

    normalized[`client${v}Text`] = extension.text;
    normalized[`client${v}Event`] = extension.event;
    const type = extension.type;
    if (type) {
        normalized[`client${v}Type`] = type.toLocaleUpperCase();
        if ("default" === type) {
            if (extension.className) {
                normalized[`client${v}Color`] = extension.className;
            }
        }
    }

    if (actions.hasOwnProperty(extension.key)) {
        /*
         * 服务端模式
         */
        normalized.actionMode = "SERVER";
        /*
         * 服务端模式的特殊配置
         */
        const serverConfig = actions[extension.key];
        if (serverConfig) {
            /*
             * 权限码和服务端事件
             */
            normalized.serverEvent = serverConfig.event;
            normalized.serverCode = serverConfig.action;
            /*
             * 读取配置
             */
            const {config = {}} = serverConfig;
            const {uri, dialog = {}} = config;
            normalized.serverUri = uri;
            /*
             * 窗口配置
             */
            if ("MESSAGE" === dialog.component) {
                normalized.callbackUi = "MESSAGE";
            } else {
                normalized.callbackUi = "DIALOG";
            }
            normalized.callbackType = dialog.mode;
            normalized.callbackContent = dialog.content;
            normalized.callbackTitle = dialog.title;
        }
    } else {
        /*
         * 客户端模式
         */
        normalized.actionMode = "CLIENT";
    }
}

export default (normalized = {}, data = {}, reference) => {
    /* 是否隐藏 */
    normalized.isHidden = Ux.valuePath(data, "hidden");
    const {$form = {}} = reference.props;
    const {actions = {}} = $form;
    /* Extension */
    const extension = Ux.valuePath(data, "optionJsx.extension");
    if (Ux.isArray(extension)) {
        const resetFound = Ux.elementUnique(extension, "event", "RESET");
        if (resetFound) {
            normalized.clientReset = true;
        }
        /*
         * 直接过滤掉 RESET
         */
        const filtered = extension.filter(item => "RESET" !== item.event);
        /*
         * 主提交
         */
        const submit = filtered[0];
        if (submit) {
            dataSubmit(normalized, submit, actions);
        }
        /*
         * 辅助提交
         */
        const secondary = filtered[1];
        if (secondary) {
            dataSubmit(normalized, secondary, actions, "2");
        }
    }
}