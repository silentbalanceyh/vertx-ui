import React from 'react';
import {component} from "../../../_internal";
import LoadingContent from '../../../loading/LoadingContent/UI';
import Ux from 'ux';
import {Form, Tag} from "antd";
import Op from '../op';
import '../Cab.less';
import renderType from './Web.Type';

const yiInternal = (reference) => {
    const state = {};
    /* 构造 $layout 变量 */
    Ux.raftForm(reference, {
        id: "SubForm-Parser",
        renders: {
            expression: (reference, jsx) => {
                const type = Ux.formHit(reference, "type");
                const {config = {}} = jsx;
                return type ? renderType(reference, jsx) : (
                    <Tag color={"purple"} style={{
                        fontSize: 14
                    }}>{config.empty}</Tag>
                )
            }
        }
    }).then(raft => {
        state.raft = raft;
        state.$op = Op.actions;
        {
            // _expr 专用字段
            const expression = Ux.fromHoc(reference, "expression");
            state.$expression = Ux.clone(expression);
        }
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