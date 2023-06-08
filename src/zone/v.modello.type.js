export default {

    E_TYPE: {
        DATA_OBJECT: "DataObject",
        DATA_ARRAY: "DataArray",
        DATA_ASSIST: "DataAssist",
        DATA_TABULAR: "DataTabular",
        NAVIGATOR: "Navigator"
    },

    XT_FORMAT: {
        OBJECT: "OBJECT",
        ARRAY: "ARRAY",
        ARRAY_MAP: "ARRAY_MAP",
        ARRAY_PURE: "ARRAY_PURE",
        ARRAY_GROUP: "ARRAY_GROUP"
    },

    QR_SOURCE: {
        INNER_SEARCH: Symbol.for("INNER-SEARCH"),
        INNER_DIRECT: Symbol.for("INNER-DIRECT"),
        OUTER: Symbol.for("OUTER"),
    },

    QR_COLUMN: {
        SEARCH: "SEARCH",
        DIRECT: "DIRECT"
    },
    TYPE_LAZY_COLUMN: {
        USER: "USER",
        LAZY: "LAZY"
    },
    TYPE_EVENT: {
        BACK: "BACK",
        RESET: "RESET",
        SUBMIT: "SUBMIT",
        SUBMIT_DIALOG: "SUBMIT_DIALOG",
        SUBMIT_REDUX: "SUBMIT_REDUX",
        KEY: "KEY",
        SAVE_ROW: "SAVE_ROW"
    },
    TYPE_JSX_VALIDATE: [
        "aiRadio",
        "aiCheckbox",
        "aiSelect",
        "aiListSelector",
        "aiUserSelector",
        "aiTreeSelect",
        "aiDialogEditor",
        "aiMatrixSelector",
        "aiDatePicker",
        "aiTimePicker"
    ],
    TYPE_JSX_RENDERS: [
        "aiDialogEditor"
    ],
    TYPE_JSX_NOTIFY: [
        "aiDialogEditor"
    ],
    TYPE_ON: {
        ON_CHANGE: "onChange",
        ON_SELECT: "onSelect",
        ON_CHECKED: "onChecked"
    },
    TYPE_CONTROL: {
        FORM: "FORM",
        LIST: "LIST"
    },
    TYPE_UPLOAD: {
        CARD: "picture-card",
        TEXT: "text"
    },
    TYPE_OP: {
        OP: "OP",       // 静态执行专用，通常：前端 -> 后端调用，identifier
        ATOM: "ATOM",   // 动态执行，一般访问 UI_OP，control
        FLOW: "FLOW",   // 工作流调用
    }
}