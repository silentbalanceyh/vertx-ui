import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from "ei";
import Op from './Op';
import '../Cab.less';
import {Dsl} from "entity";

@Ux.zero(Ux.rxEtat(require("../Cab.json"))
    .cab("UI.Page3.Step3")
    .to()
)
class Component extends React.PureComponent {

    render() {
        /*
         * 配置处理
         */
        const {$inited = {}, $target = {}, $mode = Ux.Env.FORM_MODE.ADD} = this.props;
        const formAttrs = Ex.yoAmbient(this);
        formAttrs.$inited = $inited;
        formAttrs.$mode = $mode;
        formAttrs.config = {form: Ux.fromHoc(this, "form")};
        const filtered = Ux.elementFind($target, {id: $inited['columnsAct']});
        formAttrs.$a_keys_action = Dsl.getArray(filtered);
        return (
            <div className={"form-step3"}>
                <ExForm {...formAttrs} $height={"90px"}
                        $op={Op.actions}/>
            </div>
        )
    }
}

export default Component