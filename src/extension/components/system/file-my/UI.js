import React from 'react';
import Ui from "ui";

export default Ui.smartList({
    ns: require("./Cab.json"),
    name: "PxFileMy",
    Options: {
        rm: [
            "form.add",         // 关闭添加表单
            "form.filter",      // 关闭高级搜索表单
            "op.open.add",      // 按钮：添加
            "op.extra.export",  // 按钮：导出
            "op.extra.import",  // 按钮：导入
            "op.batch.delete",  // 按钮：批量删除
            "op.batch.edit",    // 按钮：批量编辑
            "op.submit.add",    // 内页：添加提交
            "op.submit.save",   // 内页：编辑提交
            "op.submit.delete", // 内页：删除提交
            "op.submit.reset",  // 内页：重置
        ]
    },
    Form: {
        name: "FormFileMy",
    }
})