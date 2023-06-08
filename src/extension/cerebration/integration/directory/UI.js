import Ui from "ui";
import Ex from 'ex';
import Ux from 'ux';
import React from 'react';
/*
 * 配置全格式
 * {
 *      "ns": "名空间对应Cab.json文件"
 * }
 */
export default Ui.smartList({
    ns: require("./Cab.json"),
    name: "Integration.Directory",
    logger: "toolkit",
    Options: {
        rm: [
            "form.filter",      // 关闭高级搜索表单
            "op.extra.export",  // 按钮：导出
            "op.extra.import",  // 按钮：导入
            "op.batch.delete",  // 按钮：批量删除
            "op.batch.edit",    // 按钮：批量编辑
        ]
    },
    Form: {
        name: "FormDirectory",
        yoOp: {
            A: "/api/i-directory",
            S: "/api/i-directory/:key",
            D: "/api/i-directory/:key"
        }
    },
    componentInit: (reference) => {
        Ex.yiAssist(reference, {})
            .then(Ux.ready).then(Ux.pipe(reference))
    },
    yoRenders: (reference) => ({
        // 访问模式处理
        visitMode: (inherit = {}) => {
            const {data = {}, config = {}} = inherit;
            const {mapping = {}} = config;
            let value = data.visitMode ? data.visitMode : [];
            value = value.map(each => mapping[each]);
            return (
                <span>
                    {value.join(" / ")}
                </span>
            );
        }
    })
})