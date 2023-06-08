import React from 'react';
import Op from '../op';
import __Zn, {DataSource, ParamPanel} from '../zero.uca.dependency';

import UiModel from '../control/web.form.sub.model';
import UiHelp from '../control/web.form.sub.help';

import UiLayout from '../control/web.form.sub.layout';
import UiHidden from '../control/web.form.sub.hidden';

import UiSettingRow from '../control/web.form.grid.row';

import UiElement from '../element';

import UiExport from '../control/web.form.sub.export';
import UiImport from '../control/web.form.sub.import';
import UiPreview from '../control/web.form.sub.preview';

export default {
    question: (reference) => {
        return (
            <UiHelp reference={reference}/>
        )
    },
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
        const data = __Zn.xtExprFlat(values);
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
            const selection = __Zn.fromHoc(reference, "selection");
            if (Component) {
                /* aiAction 专有操作 */
                return (
                    <Component {...__Zn.onUniform(reference.props)}
                               config={rest}
                               rxApi={rxApi}
                               rxModelSave={rxModelSave}
                               rxCellConfig={params => {
                                   /* 当前层数据处理 */
                                   // reference.?etState({
                                   //     $drawer: undefined,
                                   //     $setting: undefined
                                   // });
                                   __Zn.of(reference).in({
                                       $drawer: undefined,
                                       $setting: undefined
                                   }).done();
                                   __Zn.fn(reference).rxCellConfig(params);
                               }}
                               $itemAdd={selection}
                               $inited={$inited}/>
                )
            } else {
                return (
                    <div className={"ux_error"}>
                        Setting form could not be found by "{data.render}"
                    </div>
                )
            }
        } else {
            return (
                <div className={"ux_error"}>
                    The render value missing "{data.render}"
                </div>
            )
        }
    }
}