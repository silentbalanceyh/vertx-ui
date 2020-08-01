import React from 'react';
import Ux from 'ux';
import {Form} from "antd";
import Op from '../op';
import Ex from "ex";

const yiInternal = (reference) => {
    const state = {};
    Ux.raftForm(reference, {id: "Permission-Export"}).then(raft => {
        state.raft = raft;
        state.$op = {
            $opSelect: Op.rxExport,
        }
        return Ux.promise(state);
    }).then(Ux.ready).then(Ux.pipe(reference));
}

@Ux.zero(Ux.rxEtat(require("../Cab"))
    .cab("UI.Export")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        yiInternal(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$inited = {}} = this.props;
            return Ux.aiForm(this, $inited);
        }, Ex.parserOfColor("FormPerm-Export").form())
    }
}

export default Form.create({})(Component)