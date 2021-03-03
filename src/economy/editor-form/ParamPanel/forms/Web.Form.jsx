import React from 'react';
import {component} from "../../../_internal";
import LoadingContent from '../../../web/LoadingContent/UI';
import Ux from 'ux';
import {Form} from "antd";
import Op from '../op';
import '../Cab.less';

import ValueSource from '../../ValueSource/UI';

const yiInternal = (reference) => {
    const state = {};
    /* 构造 $layout 变量 */
    Ux.raftForm(reference, {
        id: "SubForm-Parameter",
        renders: {
            value: (reference, jsx = {}) => {
                return (
                    <ValueSource {...jsx} reference={reference}/>
                )
            },
        }
    }).then(raft => {
        state.raft = raft;
        state.$op = Op.actions;
        return Ux.promise(state);
    }).then(Ux.ready).then(Ux.pipe(reference));
}

@component({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Form",
})
class Component extends React.PureComponent {
    componentDidMount() {
        yiInternal(this);
    }

    render() {
        /*
         * 配置处理
         */
        return (
            <div className={"web-param-form"}>
                {Ux.xtReady(this, () => Ux.aiForm(this),
                    {component: LoadingContent}
                )}
            </div>
        );
    }
}

export default Form.create({})(Component)