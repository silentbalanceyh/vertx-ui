import Op from "../op";
import Ux from "ux";
import Image from "../images";
import React from "react";
import ValueSource from '../../ValueSource/UI';
import RestfulApi from "../../RestfulApi/UI";
import ParamInput from "../../ParamInput/UI";

export default {
    field: (reference, jsx) => {
        Op.Setting.field(reference, jsx);
        return Ux.aiSelect(reference, jsx);
    },
    render: (reference, jsx) => {
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
    },
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
        return (<ParamInput reference={reference} {...jsx}/>)
    }
}