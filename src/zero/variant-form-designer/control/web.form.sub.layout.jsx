import React from 'react';

import {LoadingContent, uca} from 'zi';
import Event from "../op";
import __Zn from '../zero.uca.dependency';

const yiInternal = (reference) => {
    const state = {};
    /* 构造 $layout 变量 */
    const layout = __Zn.fromHoc(reference, "layout");
    const $layout = {};
    if (layout) {
        const {data = {}, ...rest} = layout;
        Object.assign($layout, rest);
        $layout.data = {};
        Object.keys(data).forEach(value => {
            const raw = data[value];
            /* Layout 数据 */
            $layout.data[value] = __Zn.configForm(raw, {reference});
        })
    }
    state.$layout = $layout;
    __Zn.raftForm(reference, {id: "SubForm-Layout"}).then(raft => {
        state.raft = raft;
        state.$op = {
            $opSaveLayout: (reference) => (params = {}) => {
                __Zn.of(reference).load().handle(() => {

                    const ref = __Zn.onReference(reference, 1);
                    Event.raft(ref).onLayout(params);
                });
                // reference.?etState({$submitting: false, $loading: false});
            }
        };
        return __Zn.promise(state);
    }).then(__Zn.ready).then(__Zn.pipe(reference));
}

@uca({
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
                {__Zn.xtReady(this, () => __Zn.aiForm(this, $inited),
                    {component: LoadingContent}
                )}
            </div>
        );
    }
}

export default Component