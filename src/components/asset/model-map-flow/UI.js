import React from 'react';
import Ux from "ux";
import Ex from "ex";
import {Fn} from "app";
import Op from './Op';
import './Cab.less';

import renderStep1 from './UI.Step1';
import renderStep2 from './UI.Step2';
import renderStep3 from './UI.Step3';
import renderStep4 from './UI.Step4';
import renderStep5 from './UI.Step5';

const Jsx = {
    0: renderStep1,
    1: renderStep2,
    2: renderStep3,
    3: renderStep4,
    4: renderStep5,
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$step, $data = {}} = this.state;
            const render = Jsx[$step];
            Ux.dgDebug($data, "顶层数据")
            return (
                <div>
                    {Fn.jsxCard(this,
                        () => {
                            if (render) {
                                return render.page(this)
                            } else return false;
                        }
                    )}
                    {render ? render.op(this) : false}
                </div>
            )
        }, Ex.parserOfColor("PxModelMapFlow").page())
    }
}

export default Component