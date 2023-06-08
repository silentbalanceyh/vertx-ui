import React from 'react';
import Ui from "ui";
import Ux from 'ux';
import {ExAnnounceView} from 'ei';

const koRowFn = (reference) => (record, config, self) => {
    const op = ["$opSave", "$opReset", "$opPreview"];
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
    yoExecutor: (reference) => ({
        fnPreview: (key) => Ux.ajaxGet("/api/x-notice/:key", {key}).then($announce => {
            Ux.of(reference).in({$announce}).open().done();
            // reference.?etState({$visible: true, $announce});
        })
    }),
    renderAddOn: (reference) => {
        const {$visible = false, $announce} = reference.state;
        const attrs = {};
        attrs.rxClose = (event) => {
            Ux.prevent(event);
            Ux.of(reference).in({$announce: undefined}).hide().done();
            // reference.?etState({$visible: false, $announce: undefined})
        }
        attrs.visible = $visible;
        attrs.data = $announce;
        return (
            <ExAnnounceView {...attrs}/>
        )
    },
    Form: {
        name: "FormNotice",
        yoOp: {
            A: "/api/x-notice",
            S: "/api/x-notice/:key",
            D: "/api/x-notice/:key"
        }
    }
})