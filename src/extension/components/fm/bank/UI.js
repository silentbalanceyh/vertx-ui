import React from 'react';
import Ui from "ui";

export default Ui.smartList({
    ns: require("./Cab.json"),
    name: "PxBank",
    Options: {
        rm: [
            "form.filter",      // 关闭高级搜索表单
            "op.batch.edit",    // 按钮：批量编辑
        ]
    },
    Form: {
        name: "FormBank",
        yoOp: {
            A: "/api/bank",
            S: "/api/bank/:key",
            D: "/api/bank/:key"
        }
    }
})