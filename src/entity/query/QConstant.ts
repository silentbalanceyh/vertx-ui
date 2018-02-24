export default {
    In: {
        // 等于
        EQ: "=",
        // 不等于
        NEQ: "<>",
        // 小于
        LT: "<",
        // 小于等于
        LE: "<=",
        // 大于
        GT: ">",
        // 大于等于
        GE: ">=",
        // LIKE中的开始匹配
        STR: "~!",
        // LIKE中的结束匹配
        END: "!~",
        // LIKE专用
        ANY: "~~",

        // n - null
        NIL: "!n",
        // e - existing
        NNL: "!e",
        // i - in,
        IN: "!i",
        // x - exclude
        NIN: "!x"
    },
    Conj: {
        AND: "AND",
        OR: "OR"
    },
    Out: {
        // 转成Java专用 三元
        "=": "EQ",
        "<>": "NEQ",
        "<": "LT",
        "<=": "LE",
        ">": "GT",
        ">=": "GE",
        // In/Not In
        "!i": "IN",
        // TODO: Wait for exclude
        "!x": false,
        // 二元
        "!n": "NIL",
        "!e": "NNL",
        // 四元
        "~!": "LIKE",
        "!~": "LIKE",
        "~~": "LIKE"
    },
    Mode: {
        "~!": "START",
        "!~": "END",
        "~~": "ANYWHERE"
    }
};
