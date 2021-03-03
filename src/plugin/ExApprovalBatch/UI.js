import React from 'react';
import Ux from 'ux';
import Op from './Op';
import {LoadingAlert, LoadingContent} from 'web';
import Cmn from "../functions";

/*
 * 不可使用 Ex 包
 */
@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI")
    .form()
    .raft(2).bind(Op.actions)
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Cmn.yiPluginForm(this);
    }

    render() {
        const maxHeight = Ux.toHeight(180);
        const {$ready = false} = this.state;
        if ($ready) {
            const alert = Ux.fromHoc(this, "alert");
            return (
                <div style={{maxHeight}} className={"ux-y"}>
                    <LoadingAlert $alert={alert}/>
                    {Ux.aiForm(this, {
                        lifecycle: "INNER"
                    }, {className: "ux-form-20"})}
                </div>
            )
        } else return (
            <LoadingContent/>
        )
    }
}

export default Component;