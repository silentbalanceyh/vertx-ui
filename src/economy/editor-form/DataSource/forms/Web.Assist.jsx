import React from 'react';
import {component} from "../../../_internal";
import LoadingContent from '../../../web/LoadingContent/UI';
import Ux from 'ux';
import {Form} from "antd";
import Rdr from './Web.Field';
import Op from "../op";

const yiInternal = (reference) => {
    const state = {};
    /* 构造 $layout 变量 */
    Ux.raftForm(reference, {
        id: "SubForm-Assist", renders: {
            source: Rdr.source,
            magic: Rdr.magic
        }
    }).then(raft => {
        state.raft = raft;
        state.$op = Op.actions;
        /* 初始值 */
        const {$inited = {}} = reference.props;
        state.data = $inited;
        return Ux.promise(state);
    }).then(Ux.ready).then(Ux.pipe(reference));
}

@component({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Assist",
})
class Component extends React.PureComponent {
    componentDidMount() {
        yiInternal(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const previous = prevProps.$inited;
        const current = this.props.$inited;
        if (Ux.isDiff(current, previous)) {
            this.setState({data: Ux.clone(current)});
        }
    }

    render() {
        /*
         * 配置处理
         */
        const {data = {}} = this.state;
        return (
            <div className={"assist-form"}>
                {Ux.xtReady(this, () => Ux.aiForm(this, data),
                    {component: LoadingContent}
                )}
            </div>
        );
    }
}

export default Form.create({})(Component)