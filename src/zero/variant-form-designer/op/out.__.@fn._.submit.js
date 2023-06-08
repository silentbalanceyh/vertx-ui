import __Zn from '../zero.uca.dependency';

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

    /* 客户端部分 */
    const item = {};
    item.key = `$${params[`client${v}Id`]}`;
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
    /* 服务端部分 */
    if ("SERVER" === params.actionMode) {
        /* 提交时在extension 中挂载 server 节点用于处理 op */
        const server = {};
        server.action = params.serverCode;
        server.event = params.serverEvent;
        /* 远程配置 */
        server.clientId = item.key;
        server.clientKey = item.key;
        const config = {};
        config.uri = params.serverUri;
        /* 窗口配置 */
        const dialog = {};
        dialog.component = params.callbackUi;
        dialog.mode = params.callbackType;
        dialog.content = params.callbackContent;
        dialog.title = params.callbackTitle;
        /* 连接配置 */
        config.dialog = dialog;
        server.config = config;
        item.server = server;
    }
    extension.push(item);
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
    if (params['client2Id']) {
        dataSubmit(extension, params, "2");
    }
    if (params['clientReset']) {
        const button = __Zn.fromHoc(reference, "button");
        dataReset(extension, button);
    }
    normalized.optionJsx.extension = extension;
}