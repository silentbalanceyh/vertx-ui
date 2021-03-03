import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from "ei";
import Op from './Op';
import '../Cab.less';
import {Dsl} from "entity";

@Ux.zero(Ux.rxEtat(require("../Cab.json"))
    .cab("UI.Page1.Step3")
    .to()
)
class Component extends React.PureComponent {

    render() {
        /*
         * 配置处理
         */
        const {$source = {}, $inited = {},  $tableNames = [], $mode = Ux.Env.FORM_MODE.ADD} = this.props;
        const formAttrs = Ex.yoAmbient(this);
        formAttrs.$inited = $inited;
        formAttrs.$mode = $mode;
        formAttrs.config = {form: Ux.fromHoc(this, "form")};
        const filtered = Ux.elementFind($source, {id: $inited['columns']});
        formAttrs.$a_table_keys = Dsl.getArray(filtered);
        formAttrs.$source = $source;
        formAttrs.$tableNames = $tableNames;
        return (
            <div className={"form-step1"}>
                <ExForm {...formAttrs} $height={"90px"}
                        $op={Op.actions}/>
            </div>
        )
    }
}

export default Component