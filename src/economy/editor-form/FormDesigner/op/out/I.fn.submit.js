import Ux from 'ux';

const dataReset = (extension = [], button = {}) => {
    const item = {};
    item.key = "$opReset";
    item.text = button.reset;
    item.event = "RESET";
    item.className = "";
    item.type = "default";
    extension.push(item);
}

const dataSubmit = (extension = [], params = {}, flag) => {
    /* 第一提交，第二提交 */
    const v = flag ? flag : "";
    if ("CLIENT" === params.actionMode) {
        /* 客户端模式 */
        const item = {};
        item.key = params[`client${v}Id`];
        item.id = item.key;     // id（隐藏时的核心参数）
        item.text = params[`client${v}Text`];
        item.event = params[`client${v}Event`];
        if (params[`client${v}Type`]) {
            if ("DEFAULT" === params[`client${v}Type`]) {
                item.type = "default";
                if (params[`client${v}Color`]) {
                    item.className = params[`client${v}Color`];
                }
            } else {
                item.type = params[`client${v}Type`].toLocaleLowerCase();
            }
        }
        extension.push(item);
    } else {
        /* 服务端模式 */

    }
}

export default (normalized = {}, params = {}, reference) => {
    /* 提交按钮专用 */
    if (params.isHidden) {
        normalized.hidden = true;
    }
    const extension = [];
    /* 主提交 */
    dataSubmit(extension, params);
    /* 辅助提交 */
    if (params.client2Id) {
        dataSubmit(extension, params, "2");
    }
    if (params.clientReset) {
        const button = Ux.fromHoc(reference, "button");
        dataReset(extension, button);
    }
    normalized.optionJsx.extension = extension;
}