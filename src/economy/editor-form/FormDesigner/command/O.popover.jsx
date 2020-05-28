import React from 'react';
import DataSource from '../../DataSource/UI';
import ParamPanel from '../../ParamPanel/UI';
import Ux from 'ux';
import Op from '../op';

import UiModel from '../control/Web.Model';
import UiLayout from '../control/Web.Layout';
import UiHidden from '../control/Web.Hidden';

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
        const {raft = {}} = reference.state;
        const values = {};
        if (raft.form) {
            const initial = raft.form.initial;
            if (initial) {
                Object.assign(values, initial);
            }
        }
        const data = Ux.xtExprFlat(values);
        return (<ParamPanel reference={reference}
                            data={data}
                            onChange={(data = []) =>
                                Op.raft(reference).onInit(data)}/>)
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