import Ux from 'ux';
/*
 * 反向赋值
 */
const dataSubmit = (normalized = {}, extension = {}, actions = {}, flag) => {
    // console.info(extension, actions);
    if (actions.hasOwnProperty(extension.key)) {
        /*
         * 服务端模式
         */
        normalized.actionMode = "SERVER";
    } else {
        /*
         * 客户端模式
         */
        normalized.actionMode = "CLIENT";
    }
    /* 使用客户端和服务端双模式计算最终核心信息 */
    console.info(normalized, extension, actions);
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
            normalized.reset = resetFound.text;
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
            dataSubmit(normalized, submit, actions, "2");
        }
    }
}