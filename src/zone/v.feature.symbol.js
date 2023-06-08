const K_NAME = {
    BUTTON: "$button",
    BODY: "$body",
    FILTER: "$filter",
    ROUTER: "$router",
    HEIGHT_STYLE: "$heightStyle",
    EMPTY: "$empty",
    DATUM: "$datum",
    FORMAT: "$format",
    OPTION: "$option",
    MAPPING: "$mapping",
    RENDER: "$render",
    SUBMITTING: "$submitting",
    SELECTED: "$selected",
    DATA: "$data",
    EXPR: "$expr",
    CONFIG: "$config",
    INITED: "$inited",
    // Extension
    CONDITION: "$condition",
    QUERY: "$query",
    LOADING: "$loading",
    VISIBLE: "$visible",
    DIRTY: "$dirty",
    OPENED: "$opened",
    BAG: "$bag",

    _PROPS: "props",
    _STATE: "state",

    _PAGER: "pager",
    _PROJECTION: "projection",
    _SORTER: "sorter",
    _CRITERIA: "criteria",

    _FILE_OBJ_ORIGIN: "originFileObj",
    _DATA_FIELD: "data-field",
    _DATA_INITIAL: "data-initial",
    _DATA_SOURCE: "data-source",

    $DATA_META: "data-__meta",
    $DATA_FIELD: 'data-__field',
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    FORBIDDEN: "********",
    CV_EXPAND: "EXPAND",
    CV_DELETE: "__DELETE__",
    // Syntax Parser
    SYNTAX_KV: "$KV$",
    SYNTAX_CLEAR: "$CLEAR$",
    // K_NAME
    K_NAME: {
        ...K_NAME,
        // 列专用
        V_COLUMN: {
            DATUM: K_NAME.DATUM,
            FORMAT: K_NAME.FORMAT,
            OPTION: K_NAME.OPTION,
            MAPPING: K_NAME.MAPPING,
            FILTER: K_NAME.FILTER,
            RENDER: K_NAME.RENDER,
            EXPR: K_NAME.EXPR,
            EMPTY: K_NAME.EMPTY,
            CONFIG: K_NAME.CONFIG,
        },
    },
    // K_UI
    K_UI: {
        BTN_CLEAR_PREFIX: "__BTN_CLEAR_",
        BTN_CLEAR_SEARCH: "__BTN_CLEAR_SEARCH",
        BTN_CLEAR_KEYWORD: "__BTN_CLEAR_KEYWORD",
        BTN_TREE_OFF: "__BTN_TREE_OFF",
        BTN_TREE_ON: "__BTN_TREE_ON",
        ELE_HEADER: "__ELE_HEADER",
        PATTERN: "__PATTERN__"
    },
    // K_ARG
    K_ARG: {
        PID: "pid",             // page   id
        MID: "mid",             // module id
        TID: "tid",             // task   id
        AID: "aid",             // app    id
        KEY: "key",             // key for ui and element
        ID: "id",               // key for html and anchor
        TARGET: "target",       // target page url
        QR: {
            PAGER: K_NAME._PAGER,
            CRITERIA: K_NAME._CRITERIA,
            PROJECTION: K_NAME._PROJECTION,
            SORTER: K_NAME._SORTER
        }
    },
    // K_VALUE
    K_VALUE: {
        LANGUAGE: "cn",
        YUAN: "￥",
        SLASH: "/",
        // T_
        FILTERED: [
            "TEXT",
            "PURE",
            "LOGICAL",
            "MAPPING",
            "ARRAY",
            "DATUM"
        ],
        //
        COLUMN_DEFAULT: "TEXT"
    }
}