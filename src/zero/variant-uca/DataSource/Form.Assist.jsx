import React from 'react';
import {LoadingContent, uca} from 'zi';
import Rdr from './Form.Field';
import __Zn from '../zero.uca.dependency';
import Op from "./Op";

const yiInternal = (reference) => {
    const state = {};
    /* 构造 $layout 变量 */
    __Zn.raftForm(reference, {
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
        return __Zn.promise(state);
    }).then(__Zn.ready).then(__Zn.pipe(reference));
}

@uca({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI.Assist",
})
class Component extends React.PureComponent {
    componentDidMount() {
        yiInternal(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const previous = prevProps.$inited;
        const current = this.props.$inited;
        if (__Zn.isDiff(current, previous)) {
            __Zn.of(this).in({
                data: __Zn.clone(current)
            }).done()
            // this.?etState({data: __Zn.clone(current)});
        }
    }

    render() {
        /*
         * 配置处理
         */
        const {data = {}} = this.state;
        return (
            <div className={"assist-form"}>
                {__Zn.xtReady(this, () => __Zn.aiForm(this, data),
                    {component: LoadingContent}
                )}
            </div>
        );
    }
}

export default Component