import React from 'react';
import Ui from "ui";
import Ex from 'ex';

export default Ui.smartList({
    ns: require("./Cab.json"),
    name: "PxWh",
    Options: {
        rm: [
            "form.filter",      // 关闭高级搜索表单
            "op.batch.edit",    // 按钮：批量编辑
        ]
    },
    Form: {
        name: "FormWh",
        yoOp: {
            A: "/api/wh",
            S: "/api/wh/:key",
            D: "/api/wh/:key"
        },
        yoJsx: {
            regionId: Ex.Jsx.Address.regionId
        }
    }
})