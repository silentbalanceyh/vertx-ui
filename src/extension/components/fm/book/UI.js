import React from 'react';
import Ui from "ui";

export default Ui.smartList({
    ns: require("./Cab.json"),
    name: "PxBook",
    Options: {
        rm: [
            "form.add",         // 关闭添加表单
            "form.filter",      // 关闭高级搜索表单
            "op.open.add",      // 按钮：添加
            "op.extra.export",  // 按钮：导出
            "op.extra.import",  // 按钮：导入
            "op.batch.edit",    // 按钮：批量编辑
            "op.batch.delete",  // 按钮：批量删除
        ]
    },
    Form: {
        name: "FormBook",
    }
})