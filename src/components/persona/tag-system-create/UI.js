import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import Op from './Op';
import {Form} from 'antd';
import './Cab.less';
import {ExForm} from "ei";

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
            const {$inited = {},} = this.state;
            const formAttrs = Ex.yoAmbient(this);
            formAttrs.$inited = $inited;

            let $mode = Ux.toQuery("action");
            $mode = "EDIT" === $mode ? "EDIT" : "ADD";
            formAttrs.$mode = $mode;

            formAttrs.config = {form: Ux.fromHoc(this, "form")};
            return <ExForm {...formAttrs} $height={"90px"}
                           $op={Op.actions}/>;
        }, Ex.parserOfColor("PxTagSystemCreate").page());
    }
}

export default Form.create({})(Component)