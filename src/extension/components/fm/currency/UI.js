import React from 'react';
import Ui from "ui";

export default Ui.smartList({
    ns: require("./Cab.json"),
    name: "PxCurrency",
    Options: {
        rm: [
            "form.filter",      // 关闭高级搜索表单
            "op.batch.edit",    // 按钮：批量编辑
        ]
    },
    Form: {
        name: "FormCurrency",
        yoOp: {
            A: "/api/currency",
            S: "/api/currency/:key",
            D: "/api/currency/:key"
        }
    }
})