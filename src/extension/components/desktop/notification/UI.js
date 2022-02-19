import React from 'react';
import Ui from "ui";

const koRowFn = (reference) => (record, config, self) => {
    const op = ["$opSave", "$opReset"];
    if ("FINISHED" === record.status) {
        op.push("$opDelete");
    }
    const enabled = op.includes(config.key);
    if (enabled) {
        return enabled;
    } else {
        // 为false
        const {plugin = {}} = config;
        return op.includes(plugin.connect);
    }
}

export default Ui.smartList({
    ns: require("./Cab.json"),
    name: "PxNotice",
    Options: {
        rm: [
            "form.filter",      // 关闭高级搜索表单
            "op.extra.export",  // 按钮：导出
            "op.extra.import",  // 按钮：导入
            "op.extra.column",  // 按钮：导入
            "op.extra.view",    // 按钮：视图管理
            "op.batch.delete",  // 按钮：批量删除
            "op.batch.edit",    // 按钮：批量编辑
        ]
    },
    yoPlugins: (reference) => ({
        koRow: koRowFn(reference),
        koEdit: koRowFn(reference)
    }),
    Form: {
        name: "FormNotice",
        yoOp: {
            A: "/api/x-notice",
            S: "/api/x-notice/:key",
            D: "/api/x-notice/:key"
        }
    }
})