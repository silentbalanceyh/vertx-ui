import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from "ei";
import Op from './Op';
import '../Cab.less';

import FormSub from './UI.Form.Sub';

@Ux.zero(Ux.rxEtat(require("../Cab.json"))
    .cab("UI.Step3")
    .to()
)
class Component extends React.PureComponent {

    render() {
        /*
         * 配置处理
         */
        const {$inited = {}, $mode = Ux.Env.FORM_MODE.ADD} = this.props;
        const formAttrs = Ex.yoAmbient(this);
        formAttrs.$inited = $inited;
        formAttrs.$mode = $mode;
        formAttrs.config = {form: Ux.fromHoc(this, "form")};
        return (
            <div className={"form-step1"}>
                <ExForm {...formAttrs} $height={"90px"}
                        $form={{
                            FormSub,
                        }}
                        $op={Op.actions}/>
            </div>
        )
    }
}

export default Component