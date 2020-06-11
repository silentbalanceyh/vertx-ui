import Ux from 'ux';
/*
 * 反向赋值
 */
const dataSubmit = (normalized = {}, extension = {}, flag) => {
    if ("SERVER" === extension.mode) {
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
}

export default (normalized = {}, data = {}, reference) => {
    /* 是否隐藏 */
    normalized.isHidden = Ux.valuePath(data, "hidden");
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
            dataSubmit(normalized, submit);
        }
        /*
         * 辅助提交
         */
        const secondary = filtered[1];
        if (secondary) {
            dataSubmit(normalized, submit, "2");
        }
    }
}