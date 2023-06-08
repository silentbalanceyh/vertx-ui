import React from 'react';
import Op from './Op';
import __Zn from '../zero.uca.dependency';
import {LoadingContent, uca} from 'zi';
import {Dsl} from 'entity';

const yiInternal = (reference) => {
    const state = {};
    /* 构造 $layout 变量 */
    __Zn.raftForm(reference, {
        id: "SubForm-Category",
    }).then(raft => {
        state.raft = raft;
        state.$op = Op.actions;
        return __Zn.parallel([
            __Zn.fn(reference).rxSource({type: "CATEGORY"}, true),
            __Zn.fn(reference).rxSource({type: "CATEGORY"})
        ], "define", "data").then((response = {}) => {
            const {define = {}, data = []} = response;
            state.$define = define;
            state.$a_define_types = Dsl.getArray(data);
            return __Zn.promise(state);
        }).catch(error => {
            console.error(error);
            state.$define = {};
            state.$a_define_types = Dsl.getArray([]);
            return __Zn.promise(state);
        })
    }).then(__Zn.ready).then(__Zn.pipe(reference));
}

@uca({
    "i18n.cab": require('./Cab.json'),
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
        const processed = __Zn.clone($define);
        Object.assign(processed, $inited);      // 默认值被输入值覆盖

        return (
            <div className={"category-form"}>
                {__Zn.xtReady(this, () => __Zn.aiForm(this, processed),
                    {component: LoadingContent}
                )}
            </div>
        );
    }
}

export default Component