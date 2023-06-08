import React from 'react';

import {LoadingContent, uca} from 'zi';
import __Zn from '../zero.uca.dependency';

const yiInternal = (reference) => {
    const state = {};
    __Zn.raftForm(reference, {id: "SubForm-FieldAddition"}).then(raft => {
        state.raft = raft;
        state.$op = {
            $opAddField: (reference) => (params = {}) => {
                // reference.?etState({$loading: false, $submitting: false});
                /* 防重复提交 */
                __Zn.of(reference).load().handle(() => {

                    /* 关闭窗口 */
                    const {rxModelSave} = reference.props;
                    if (__Zn.isFunction(rxModelSave)) {
                        const $params = __Zn.clone(params);
                        $params.key = $params.name;
                        rxModelSave($params);
                        // 关窗口
                        __Zn.fn(reference).rxClose();
                    }
                })
            }
        }
        return __Zn.promise(state);
    }).then(__Zn.ready).then(__Zn.pipe(reference));
}

@uca({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Sub.Field",
})
class Component extends React.PureComponent {
    componentDidMount() {
        yiInternal(this);
    }

    render() {
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