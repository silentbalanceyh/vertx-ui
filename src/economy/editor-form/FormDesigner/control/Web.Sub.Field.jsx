import React from 'react';
import {component} from "../../../_internal";
import Ux from "ux";
import LoadingContent from "../../../web/LoadingContent/UI";
import {Form} from "antd";

const yiInternal = (reference) => {
    const state = {};
    Ux.raftForm(reference, {id: "SubForm-FieldAddition"}).then(raft => {
        state.raft = raft;
        state.$op = {
            $opAddField: (reference) => (params = {}) => {
                reference.setState({$loading: false, $submitting: false});
                const {rxModelSave} = reference.props;
                if (Ux.isFunction(rxModelSave)) {
                    const $params = Ux.clone(params);
                    $params.key = $params.name;
                    rxModelSave($params);
                    // 关窗口
                    Ux.fn(reference).rxClose();
                }
            }
        }
        return Ux.promise(state);
    }).then(Ux.ready).then(Ux.pipe(reference));
}

@component({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Sub.Field",
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