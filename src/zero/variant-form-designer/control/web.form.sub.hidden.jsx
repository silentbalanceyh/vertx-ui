import React from 'react';

import {LoadingContent, uca} from 'zi';
import {Dsl} from 'entity';
import Event from "../op";
import __Zn from '../zero.uca.dependency';

const yiInternal = (reference) => {
    const state = {};
    const {data = {}} = reference.props;
    {
        const dict = [];
        const {attributes = []} = data;
        attributes.forEach(attribute => dict.push(attribute));
        state.$a_form_fields = Dsl.getArray(dict);
    }
    __Zn.raftForm(reference, {id: "SubForm-Hidden"}).then(raft => {
        state.raft = raft;
        state.$op = {
            $opSaveHidden: (reference) => (params = {}) => {
                __Zn.of(reference).load().handle(() => {

                    const ref = __Zn.onReference(reference, 1);
                    Event.raft(ref).onHidden(params);
                })
                // reference.?etState({$submitting: false, $loading: false});
            }
        }
        return __Zn.promise(state);
    }).then(__Zn.ready).then(__Zn.pipe(reference));
}

@uca({
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
                {__Zn.xtReady(this, () => __Zn.aiForm(this, $inited),
                    {component: LoadingContent}
                )}
            </div>
        );
    }
}

export default Component