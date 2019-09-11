import React from 'react';
import Ux from "ux";
import Ex from 'ex';
import Op from './Op';
import {ExComplexList} from "ei";

import {EntityAdd as FormAdd, EntityEdit as FormEdit, EntityFilter as FormFilter,} from "../form";

const LOG = {
    name: "ExEntity",
    color: "#698B69"
};

@Ux.zero(Ux.rxEtat(require('../Cab.json'))
    .cab("UI.Entity")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const config = Ux.fromHoc(this, "grid");
            const form = {
                FormAdd,        // 主单（添加）
                FormEdit,       // 主单（编辑）
                FormFilter,     // 过滤单
            };
            return (
                <ExComplexList {...Ex.yoAmbient(this)}
                               config={config} $form={form}/>
            );
        }, LOG)
    }
}

export default Component;