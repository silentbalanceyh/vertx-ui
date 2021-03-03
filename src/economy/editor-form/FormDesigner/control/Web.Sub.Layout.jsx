import React from 'react';
import {component} from "../../../_internal";
import LoadingContent from '../../../web/LoadingContent/UI';
import Ux from 'ux';
import {Form} from "antd";
import Event from "../op";

const yiInternal = (reference) => {
    const state = {};
    /* 构造 $layout 变量 */
    const layout = Ux.fromHoc(reference, "layout");
    const $layout = {};
    if (layout) {
        const {data = {}, ...rest} = layout;
        Object.assign($layout, rest);
        $layout.data = {};
        Object.keys(data).forEach(value => {
            const raw = data[value];
            /* Layout 数据 */
            $layout.data[value] = Ux.configForm(raw, {reference});
        })
    }
    state.$layout = $layout;
    Ux.raftForm(reference, {id: "SubForm-Layout"}).then(raft => {
        state.raft = raft;
        state.$op = {
            $opSaveLayout: (reference) => (params = {}) => {
                const ref = Ux.onReference(reference, 1);
                Event.raft(ref).onLayout(params);
                reference.setState({$submitting: false, $loading: false});
            }
        };
        return Ux.promise(state);
    }).then(Ux.ready).then(Ux.pipe(reference));
}

@component({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Sub.Layout",
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
            <div className={"viewer-layout"}>
                {Ux.xtReady(this, () => Ux.aiForm(this, $inited),
                    {component: LoadingContent}
                )}
            </div>
        );
    }
}

export default Form.create({})(Component)