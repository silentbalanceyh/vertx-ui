import React from 'react';
import {component} from "../../../_internal";
import LoadingContent from '../../../web/LoadingContent/UI';
import Ux from 'ux';
import {Form} from "antd";
import {Dsl} from 'entity';
import Op from '../op';

const yiInternal = (reference) => {
    const state = {};
    /* 构造 $layout 变量 */
    Ux.raftForm(reference, {
        id: "SubForm-Category",
    }).then(raft => {
        state.raft = raft;
        state.$op = Op.actions;
        return Ux.parallel([
            Ux.fn(reference).rxSource({type: "CATEGORY"}, true),
            Ux.fn(reference).rxSource({type: "CATEGORY"})
        ], "define", "data").then((response = {}) => {
            const {define = {}, data = []} = response;
            state.$define = define;
            state.$a_define_types = Dsl.getArray(data);
            return Ux.promise(state);
        }).catch(error => {
            console.error(error);
            state.$define = {};
            state.$a_define_types = Dsl.getArray([]);
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

        const {$define = {}} = this.state;
        const processed = Ux.clone($define);
        Object.assign(processed, $inited);      // 默认值被输入值覆盖

        return (
            <div className={"category-form"}>
                {Ux.xtReady(this, () => Ux.aiForm(this, processed),
                    {component: LoadingContent}
                )}
            </div>
        );
    }
}

export default Form.create({})(Component)