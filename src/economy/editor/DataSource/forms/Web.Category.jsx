import React from 'react';
import {component} from "../../../_internal";
import LoadingContent from '../../../loading/LoadingContent/UI';
import Ux from 'ux';
import {Form} from "antd";
import {Dsl} from 'entity';
import Rdr from './Web.Field';
import Op from '../op';

const yiInternal = (reference) => {
    const state = {};
    /* 构造 $layout 变量 */
    Ux.raftForm(reference, {
        id: "SubForm-Category",
        renders: {
            typesJson: Rdr.typesJson
        }
    }).then(raft => {
        state.raft = raft;
        state.$op = Op.actions;
        return Ux.fn(reference).rxSource({type: "CATEGORY"}).then(response => {
            /* 读取数据 */
            state.$a_define_types = Dsl.getArray(response);
            return Ux.promise(state);
        })
    }).then(Ux.ready).then(Ux.pipe(reference));
}

@component({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Category",
})
class Component extends React.PureComponent {
    componentDidMount() {
        yiInternal(this);
    }

    render() {
        /*
         * 配置处理
         */
        const {$inited = {}} = this.props;
        return (
            <div className={"category-form"}>
                {Ux.xtReady(this, () => Ux.aiForm(this, $inited),
                    {component: LoadingContent}
                )}
            </div>
        );
    }
}

export default Form.create({})(Component)