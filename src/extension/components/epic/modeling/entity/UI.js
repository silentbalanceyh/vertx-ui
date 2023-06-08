import React from 'react';
import Ux from "ux";
import Ex from 'ex';
import Op from './Op';
import {ExListComplex} from "ei";

import {EntityAdd as FormAdd, EntityEdit as FormEdit, EntityFilter as FormFilter,} from "./form";

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
                <ExListComplex {...Ex.yoAmbient(this)}
                               config={config} $form={form}/>
            );
        }, Ex.parserOfColor("PxEntity").control())
    }
}

export default Component;