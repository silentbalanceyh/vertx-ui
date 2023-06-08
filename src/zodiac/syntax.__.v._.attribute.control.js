import __Zn from './zero.module.dependency';

const windowDefinition = {
    window: [
        "title",
        "okText",
        "cancelText",
        "open",
        "width",
        "maskClosable",
        "onOk",
        "component"
    ],
    drawer: [
        "title",
        "placement",
        "width",
        "closable",
        "maskClosable",
        "open"
    ],
    popover: [
        "title",
        "placement",
        "width",
        "closable",
        "open"
    ],
};
const ajaxDefinition = {
    ajax: [
        "method",
        "uri",
        "params.pager.page",
        "params.pager.size",
        __Zn.Env.SYNTAX_KV
    ],
};
const formDefinition = {
    field: [
        "field",
        "optionItem.label",
        "span",
        "optionJsx.style.width",
        "render",
        __Zn.Env.SYNTAX_KV
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
        __Zn.Env.SYNTAX_KV
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
        __Zn.Env.SYNTAX_KV
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
        __Zn.Env.SYNTAX_KV
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
        __Zn.Env.SYNTAX_KV
    ]
};
const columnDefinition = {
    column: [
        "dataIndex",
        "title",
        "$render",
        "sorter",
        __Zn.Env.SYNTAX_KV
    ],
};
const optionDefinition = {
    option: [
        "key",
        "label",
        "style"
    ],
    icon: [
        "text",
        "icon",
        "iconStyle.fontSize",
        "iconStyle.color",
        "style.color",
        __Zn.Env.SYNTAX_KV
    ],
    filter: [
        "source",
        "field",
        "type",
        "cond"
    ],
};
export default {
    "tabs": [
        "tab",
        "key",
        "icon",
        __Zn.Env.SYNTAX_KV
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