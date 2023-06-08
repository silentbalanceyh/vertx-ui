import React from 'react';
import Op from './Op';
import ValueSource from './Form.Source';
import __Zn from '../zero.uca.dependency';
import {LoadingContent, uca} from 'zi';

const yiInternal = (reference) => {
    const state = {};
    /* 构造 $layout 变量 */
    __Zn.raftForm(reference, {
        id: "SubForm-Parser",
        renders: {
            value: (reference, jsx = {}) => {
                const {$expression = {}} = reference.state;
                jsx.$expression = $expression;
                return (
                    <ValueSource {...jsx} reference={reference}/>
                )
            },
        }
    }).then(raft => {
        state.raft = raft;
        state.$op = Op.actions;
        {
            // _expr 专用字段
            const expression = __Zn.fromHoc(reference, "expression");
            state.$expression = __Zn.clone(expression);
        }
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