import React from 'react';
import {component} from "../../../_internal";
import LoadingContent from "../../../loading/LoadingContent/UI";
import Ux from 'ux';
import {Form} from "antd";
import Op from '../op';

const yiInternal = (reference) => {
    const state = {};
    Ux.raftForm(reference, {id: "SubForm-Export"}).then(raft => {
        state.raft = raft;
        state.$op = {
            $opSaveExport: (reference) => (params = {}) => {
                /* 读取数据信息 */
                const ref = Ux.onReference(reference, 1);
                if (ref) {
                    const data = Op.rxRequest(ref);
                    const {filename} = params;
                    /* 表单数据 */
                    const exportJson = {_form: data.form};
                    Ux.dgFileJson(exportJson, filename);
                    /* 关闭窗口 */
                    Ux.fn(reference).rxClose();
                }
                reference.setState({$submitting: false, $loading: false});
            }
        }
        return Ux.promise(state);
    }).then(Ux.ready).then(Ux.pipe(reference));
}

@component({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Sub.Export",
})
class Component extends React.PureComponent {
    componentDidMount() {
        yiInternal(this);
    }

    render() {
        const {$inited = {}} = this.props;
        return (
            <div className={"viewer-layout"}>
                {Ux.xtReady(this, () => Ux.aiForm(this, $inited),
                    {component: LoadingContent}
                )}
            </div>
        );
    }
}

export default Form.create({})(Component)