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

import UiExport from '../control/Web.Final.Export';
import UiImport from '../control/Web.Final.Import';
import UiPreview from '../control/Web.Final.Preview';

export default {
    import: (reference) => {
        return (
            <UiImport reference={reference}
                      rxSubmit={Op.rxDataSave(reference)}/>
        )
    },
    preview: (reference) => {
        const data = Op.rxDataRequest(reference);
        return (
            <UiPreview reference={reference} data={data}
                       rxSubmit={Op.rxDataSave(reference)}/>
        )
    },
    export: (reference) => {
        return (<UiExport reference={reference}
                          rxClose={Op.rxWindowClose(reference)}/>)
    },
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
        const {config = {}, rxApi, rxModelSave} = reference.props;
        const {data = {}, ...rest} = config;
        const $inited = Op.dataIn(reference)(config);
        if ($inited.render) {
            const Component = UiElement[$inited.render];
            const selection = Ux.fromHoc(reference, "selection");
            if (Component) {
                return (
                    <Component {...Ux.onUniform(reference.props)}
                               config={rest}
                               rxApi={rxApi}
                               rxModelSave={rxModelSave}
                               rxCellConfig={params => {
                                   /* 当前层数据处理 */
                                   reference.setState({
                                       $drawer: undefined,
                                       $setting: undefined
                                   });
                                   Ux.fn(reference).rxCellConfig(params);
                               }}
                               $itemAdd={selection}
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