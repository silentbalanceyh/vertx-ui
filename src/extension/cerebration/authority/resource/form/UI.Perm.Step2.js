import Ux from "ux";
import React from "react";
import Op from './op/Op';
import Ex from 'ex';
import {Table} from 'antd';

@Ux.zero(Ux.rxEtat(require("../Cab.json"))
    .cab("UI.Perm.Step2")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiStep2(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuStep2(this, {props: prevProps, state: prevState});
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$data = [], $table, __dialog} = this.state;
            return (
                <div className={""}>
                    <Table {...$table} dataSource={$data}/>
                    {__dialog.render()}
                </div>
            )
        }, Ex.parserOfColor("PxWizardStep2").control())
    }
}

export default Component