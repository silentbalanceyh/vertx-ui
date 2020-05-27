import React from 'react';
import {component} from "../../../_internal";
import LoadingContent from "../../../loading/LoadingContent/UI";
import Ux from 'ux';
import {Form} from "antd";
import {Dsl} from 'entity';
import Event from "../op";

const yiInternal = (reference) => {
    const state = {};
    const {data = {}} = reference.props;
    {
        const dict = [];
        const {attributes = []} = data;
        attributes.forEach(attribute => dict.push(attribute));
        state.$a_form_fields = Dsl.getArray(dict);
    }
    Ux.raftForm(reference, {id: "SubForm-Hidden"}).then(raft => {
        state.raft = raft;
        state.$op = {
            $opSaveHidden: (reference) => (params = {}) => {
                const ref = Ux.onReference(reference, 1);
                Event.raft(ref).onHidden(params);
                reference.setState({$submitting: false, $loading: false});
            }
        }
        return Ux.promise(state);
    }).then(Ux.ready).then(Ux.pipe(reference));
}

@component({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Sub.Hidden",
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