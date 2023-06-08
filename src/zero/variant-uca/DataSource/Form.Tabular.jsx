import React from 'react';
import {Dsl} from 'entity';
import Op from "./Op";
import {LoadingContent, uca} from 'zi';
import __Zn from '../zero.uca.dependency';

const yiInternal = (reference) => {
    const state = {};
    /* 构造 $layout 变量 */
    __Zn.raftForm(reference, {
        id: "SubForm-Tabular",
    }).then(raft => {
        state.raft = raft;
        state.$op = Op.actions;
        /*
         * 一个 define
         * 一个 data
         */
        return __Zn.parallel([
            /* 读取定义信息 */
            __Zn.fn(reference).rxSource({type: "TABULAR"}, true),
            /* 读取非定义信息 */
            __Zn.fn(reference).rxSource({type: "TABULAR"}),
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
    "i18n.name": "UI.Tabular",
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
            <div className={"tabular-form"}>
                {__Zn.xtReady(this, () => __Zn.aiForm(this, processed),
                    {component: LoadingContent}
                )}
            </div>
        );
    }
}

export default Component