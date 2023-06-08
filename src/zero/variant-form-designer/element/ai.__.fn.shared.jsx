import Op from "../op";
import Image from "../images";
import React from "react";

import __Zn, {DatumUnique, ParamInput, RestfulApi, ValueSource} from '../zero.uca.dependency';

import FieldAddition from '../control/web.form.sub.field';

import {LoadingContent} from 'zi';
import {Divider, Modal} from "antd";

const jsxFieldDialog = (reference) => {
    const {$dialogField, $visible} = reference.state;
    const {rxModelSave} = reference.props;
    return $dialogField ? (
        <Modal {...$dialogField} open={$visible}>
            <FieldAddition rxModelSave={rxModelSave}
                           rxClose={$dialogField.onCancel}/>
        </Modal>
    ) : false
}

const field = (reference, jsx) => {
    Op.Setting.field(reference, jsx);
    const {$itemAdd = {}} = reference.props;
    jsx.dropdownClassName = "web-form-designer-dropdown";
    jsx.dropdownRender = menu => (
        <div>
            {menu}
            <Divider style={{margin: '2px 0'}}/>
            <div className={"item-add"}
                 onMouseDown={event => event.preventDefault()}
                 onClick={Op.rxCellField(reference)}>
                {__Zn.v4Icon("plus")}&nbsp;&nbsp;{$itemAdd.text}
            </div>
        </div>
    )
    return __Zn.aiSelect(reference, jsx);
};
const render = (reference, jsx) => {
    const {$inited = {}} = reference.props;
    const item = __Zn.elementUniqueDatum(reference,
        "model.components", "key", $inited.render)
    const img = Image[item.key];
    return (
        <span className={"render"}>
            <img src={img} alt={item.key}/>
            <label>
                {item.text}
            </label>
        </span>
    )
}
export default {
    yiComponent: (reference, configuration = {}) => {
        let {renders = {}, id = ""} = configuration;
        renders.field = field;
        renders.render = render;
        const state = {};
        __Zn.raftForm(reference, {
            id,
            renders,
        }).then(raft => {
            state.raft = raft;
            // Action 提交专用配置
            state.$op = {
                // 保存配置专用
                $opSaveSetting: Op.dataOut,
            };
            // 字段专用窗口
            const {$itemAdd} = reference.props;
            if ($itemAdd && $itemAdd.window) {
                // const $config = __Zn.configDialog(reference, $itemAdd.window);
                state.$dialogField = __Zn.configDialog(reference, $itemAdd.window)
            }
            return __Zn.promise(state);
        }).then(__Zn.ready).then(__Zn.pipe(reference));
    },
    yoComponent: (reference, $inited = {}) => {
        return (
            <div className={"viewer-layout"}>
                {__Zn.xtReady(reference, () => __Zn.aiForm(reference, $inited),
                    {component: LoadingContent}
                )}
                {jsxFieldDialog(reference)}
            </div>
        )
    },
    yoRenders: {
        // 级联选择 API
        cascadeValue: (reference, jsx) => {
            return (
                <ValueSource {...jsx}
                             reference={reference}
                             field={"cascadeTarget"}/>
            )
        },
        // 上传部分 API
        uploadUpApi: (reference, jsx) => {
            const {rxApi} = reference.props;
            return (
                <RestfulApi rxSource={rxApi}
                            reference={reference}
                            {...jsx} />
            )
        },
        uploadUpParam: (reference, jsx) => {
            return (<ParamInput {...jsx} reference={reference} $query/>)
        },
        uploadDownApi: (reference, jsx) => {
            const {rxApi} = reference.props;
            return (
                <RestfulApi rxSource={rxApi}
                            reference={reference}
                            {...jsx} />
            )
        },
        // 地址选择 API
        addrCountryApi: (reference, jsx) => {
            const {rxApi} = reference.props;
            return (
                <RestfulApi rxSource={rxApi}
                            reference={reference}
                            {...jsx} />
            )
        },
        addrStateApi: (reference, jsx) => {
            const {rxApi} = reference.props;
            return (
                <RestfulApi rxSource={rxApi}
                            reference={reference}
                            {...jsx} />
            )
        },
        addrCityApi: (reference, jsx) => {
            const {rxApi} = reference.props;
            return (
                <RestfulApi rxSource={rxApi}
                            reference={reference}
                            {...jsx} />
            )
        },
        addrRegionApi: (reference, jsx) => {
            const {rxApi} = reference.props;
            return (
                <RestfulApi rxSource={rxApi}
                            reference={reference}
                            {...jsx} />
            )
        },
        addrInitApi: (reference, jsx) => {
            const {rxApi} = reference.props;
            return (
                <RestfulApi rxSource={rxApi}
                            reference={reference}
                            {...jsx} />
            )
        },
        ajaxSource: (reference, jsx) => {
            const {rxApi} = reference.props;
            return (
                <RestfulApi rxSource={rxApi}
                            reference={reference}
                            {...jsx} />
            )
        },
        ajaxMagic: (reference, jsx) => {
            return (<ParamInput reference={reference} {...jsx} $query/>)
        },
        remoteSource: (reference, jsx) => {
            const {rxApi} = reference.props;
            return (
                <RestfulApi rxSource={rxApi}
                            reference={reference}
                            {...jsx} />
            )
        },
        serverSource: (reference, jsx) => {
            const {rxApi} = reference.props;
            return (
                <RestfulApi rxSource={rxApi}
                            reference={reference}
                            {...jsx} />
            )
        },
        server2Source: (reference, jsx) => {
            const {rxApi} = reference.props;
            return (
                <RestfulApi rxSource={rxApi}
                            reference={reference}
                            {...jsx} />
            )
        },
        datumInput: (reference, jsx) => {
            return (
                <DatumUnique {...jsx} reference={reference}/>
            )
        },
    }
}