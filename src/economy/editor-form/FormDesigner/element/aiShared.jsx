import Op from "../op";
import Ux from "ux";
import Image from "../images";
import React from "react";
import ValueSource from '../../ValueSource/UI';
import RestfulApi from "../../RestfulApi/UI";
import ParamInput from "../../ParamInput/UI";
import LoadingContent from "../../../loading/LoadingContent/UI";

const field = (reference, jsx) => {
    Op.Setting.field(reference, jsx);
    return Ux.aiSelect(reference, jsx);
};
const render = (reference, jsx) => {
    const {$inited = {}} = reference.props;
    const item = Ux.elementUniqueDatum(reference,
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
        Ux.raftForm(reference, {
            id,
            renders,
        }).then(raft => {
            state.raft = raft;
            return Ux.promise(state);
        }).then(Ux.ready).then(Ux.pipe(reference));
    },
    yoComponent: (reference, $inited = {}) => {
        return (
            <div className={"viewer-layout"}>
                {Ux.xtReady(reference, () => Ux.aiForm(reference, $inited),
                    {component: LoadingContent}
                )}
            </div>
        )
    },
    yoRenders: {
        cascadeValue: (reference, jsx) => {
            return (
                <ValueSource {...jsx} reference={reference} field={"cascadeTarget"}/>
            )
        },
        ajaxSource: (reference, jsx) => {
            const {rxApi} = reference.props;
            return (
                <RestfulApi rxSource={rxApi} rxSubmit={(value) => {
                    if (value) {

                    }
                }}/>
            )
        },
        ajaxMagic: (reference, jsx) => {
            return (<ParamInput reference={reference} {...jsx} $query/>)
        }
    }
}