import React from 'react';
import {LoadingContent, uca} from 'zi';
import Op from './Op';

import __Zn from '../zero.uca.dependency';


import ValueSource from '../ValueSource/UI';

const yiInternal = (reference) => {
    const state = {};
    /* 构造 $layout 变量 */
    __Zn.raftForm(reference, {
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
        return __Zn.promise(state);
    }).then(__Zn.ready).then(__Zn.pipe(reference));
}

@uca({
    "i18n.cab": require('./Cab.json'),
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
                {__Zn.xtReady(this, () => __Zn.aiForm(this),
                    {component: LoadingContent}
                )}
            </div>
        );
    }
}

export default Component