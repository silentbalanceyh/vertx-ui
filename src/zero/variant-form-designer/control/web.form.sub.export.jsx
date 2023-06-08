import React from 'react';
import {LoadingContent, uca} from 'zi';
import Op from '../op';
import __Zn from '../zero.uca.dependency';

const yiInternal = (reference) => {
    const state = {};
    __Zn.raftForm(reference, {id: "SubForm-Export"}).then(raft => {
        state.raft = raft;
        state.$op = {
            $opSaveExport: (reference) => (params = {}) => {
                /* 读取数据信息 */
                const ref = __Zn.onReference(reference, 1);
                if (ref) {
                    const data = Op.rxDataRequest(ref);
                    const {filename} = params;
                    /* 表单数据 */
                    const formData = __Zn.clone(data.form);
                    if (formData.actions) {
                        delete formData.actions;
                    }
                    if (formData.options) {
                        delete formData.options;
                    }
                    const exportJson = {_form: formData};

                    __Zn.dgFileJson(exportJson, filename);

                    /* 防重复提交 */
                    __Zn.of(reference).load().handle(() => {
                        
                        /* 关闭窗口 */
                        __Zn.fn(reference).rxClose();
                    })
                    // reference.?etState({$submitting: false, $loading: false});
                    //
                    // /* 关闭窗口 */
                    // __Zn.fn(reference).rxClose();
                }
            }
        }
        return __Zn.promise(state);
    }).then(__Zn.ready).then(__Zn.pipe(reference));
}

@uca({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Sub.Export",
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