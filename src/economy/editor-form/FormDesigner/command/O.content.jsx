import React from 'react';
import DataSource from '../../DataSource/UI';
import ParamPanel from '../../ParamPanel/UI';
import Ux from 'ux';
import Op from '../op';

import UiModel from '../control/Web.Model';
import UiLayout from '../control/Web.Layout';
import UiHidden from '../control/Web.Hidden';
import UiSettingRow from '../control/Web.Setting.Row';

import UiElement from '../element';

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
    },
    /* 行操作 */
    setting: (reference) => {
        const {config = {}} = reference.props;
        const {$inited} = reference.state;
        return (
            <UiSettingRow reference={reference}
                          $inited={$inited}
                          config={config}/>
        )
    },
    /* 列操作 */
    control: (reference) => {
        const {config = {}, rxApi} = reference.props;
        const {data = {}, ...rest} = config;
        const $inited = Op.dataIn(data, reference);
        if ($inited.render) {
            const Component = UiElement[$inited.render];
            if (Component) {
                return (
                    <Component {...Ux.onUniform(reference.props)}
                               config={rest} rxApi={rxApi}
                               $inited={$inited}/>
                )
            } else {
                return (
                    <div className={"ux-error"}>
                        Setting form could not be found by "{data.render}"
                    </div>
                )
            }
        } else {
            return (
                <div className={"ux-error"}>
                    The render value missing "{data.render}"
                </div>
            )
        }
    }
}