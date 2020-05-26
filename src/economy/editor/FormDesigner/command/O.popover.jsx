import React from 'react';
import UiModel from '../forms/Web.Model';
import UiLayout from '../forms/Web.Layout';
import UiHidden from '../forms/Web.Hidden';
import DataSource from '../../DataSource/UI';
import Op from '../op';

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
        const {rxApi, rxType} = reference.props;
        const {raft = {}} = reference.state;
        let assist = [];
        if (raft.form) {
            assist = raft.form.assist;
        }
        return (<DataSource rxApi={rxApi}
                            rxType={rxType}
                            rxSubmit={Op.raft(reference).onAssist}
                            reference={reference}
                            $inited={assist}/>)
    }
}