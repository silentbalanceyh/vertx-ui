const windowDefinition = {
    window: [
        "title",
        "okText",
        "cancelText",
        "visible",
        "width",
        "maskClosable",
        "onOk"
    ],
    drawer: [
        "title",
        "placement",
        "width",
        "closable",
        "maskClosable",
        "visible"
    ],
    popover: [
        "title",
        "placement",
        "width",
        "closable",
        "visible"
    ],
};
const ajaxDefinition = {
    ajax: [
        "method",
        "uri",
        "params.pager.page",
        "params.pager.size",
        "$KV$"
    ],
};
const formDefinition = {
    field: [
        "field",
        "optionItem.label",
        "span",
        "optionJsx.style.width",
        "render",
        "$KV$"
    ],
};
const buttonDefinition = {
    /*
     * 连接按钮专用，点击该按钮过后会触发 connectId操作
     */
    button: [
        "key",
        "text",
        "connectId",
        "type",
        "icon",
        "disabledKey",
        "$KV$"
    ],
    /*
     * 提交按钮专用，点击该按钮过后会触发 EVENT 事件
     */
    op: [
        "key",
        "text",
        "event",
        "type",
        "className",
        "icon",
        "$KV$"
    ],
    /*
     * DialogMenu / DialogButton 专用
     */
    action: [
        "key",
        "text",
        "type",
        "icon",
        "confirm",
        "$KV$"
    ],
    /*
     * command 专用
     */
    command: [
        "key",              // 事件专用 key，依靠这个绑定
        "text",             // 显示文字
        "className",        // 风格处理
        "confirm",          // confirm 窗口
        "confirmPosition",  // confirm 位置
        "icon",             // 图标信息
        "tooltip",          // tooltip 打开（打开过后文字放到 tooltip中）
        "$KV$"
    ]
};
const columnDefinition = {
    icon: [
        "text",
        "icon",
        "iconStyle.fontSize",
        "iconStyle.color",
        "style.color",
        "$KV$"
    ],
    column: [
        "dataIndex",
        "title",
        "$render",
        "sorter",
        "$KV$"
    ],
};
const optionDefinition = {
    option: [
        "key",
        "label",
        "style"
    ],
};
export default {
    "filter": [
        "source",
        "field",
        "type",
        "cond"
    ],
    "tabs": [
        "tab",
        "key",
        "icon",
        "$KV$"
    ],
    // Option
    ...optionDefinition,
    // Column
    ...columnDefinition,
    // Button
    ...buttonDefinition,
    // Form
    ...formDefinition,
    // Ajax
    ...ajaxDefinition,
    // Windows
    ...windowDefinition,
};