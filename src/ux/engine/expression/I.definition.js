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