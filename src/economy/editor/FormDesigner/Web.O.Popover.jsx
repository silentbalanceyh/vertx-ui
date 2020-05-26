import React from 'react';
import UiModel from './command/UI.Model';
import UiLayout from './command/UI.Layout';
import UiHidden from './command/UI.Hidden';

export default {
    layout: (reference) => {
        return (<UiLayout reference={reference}/>)
    },
    "deployment-unit": (reference) => {
        /* 模型查看器 */
        const {$models = {}, $modelsAttr} = reference.state;
        return (<UiModel data={$models} $status={$modelsAttr}/>)
    },
    "eye-invisible": (reference) => {
        /* 隐藏字段处理 */
        const {$models = {}, raft = {}} = reference.state;
        let hidden = [];
        if (raft.form) {
            hidden = raft.form.hidden;
        }
        return (<UiHidden data={$models} reference={reference}
                          $inited={{hidden}}/>)
    }
}