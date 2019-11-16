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
        "page",
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
    button: [
        "key",
        "text",
        "connectId",
        "type",
        "icon",
        "disabledKey",
        "$KV$"
    ],
    // 按钮相关
    op: [
        "key",
        "text",
        "event",
        "type",
        "className",
        "$KV$"
    ],
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