import React from 'react';
import UiModel from '../forms/UI.Model';
import UiLayout from '../forms/UI.Layout';
import UiHidden from '../forms/UI.Hidden';
import UiSource from '../forms/UI.Source';

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
    },
    code: (reference) => {

    },
    database: (reference) => {
        const {$source} = reference.props;
        return (<UiSource exeuctor={$source} reference={reference}/>)
    }
}