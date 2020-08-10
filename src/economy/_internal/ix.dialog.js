import {Icon} from "antd";
import React from "react";
import Ux from "ux";

const _renderClean = (reference) => {
    const {value} = reference.props;
    const attrs = {};
    attrs.type = "delete";
    attrs.style = {
        fontSize: 14
    };
    if (undefined !== value) {
        attrs.onClick = event => {
            Ux.prevent(event);
            const {config = {}, id} = reference.props;
            // 有值才清空
            if (value) {
                const values = Ux.writeLinker({}, config);
                // 表单专用处理
                const ref = Ux.onReference(reference, 1);
                const {form} = ref.props;
                if (form) {
                    if (Ux.isEmpty(values) && id) {
                        values[id] = undefined;
                    }
                    Ux.formHits(ref, values);
                }
            }
        }
    }
    return (
        <Icon {...attrs}/>
    )
}

const dialogCombine = (reference, inputAttrs = {}) => {
    const {
        onClick
    } = reference.state ? reference.state : {};
    const {value} = reference.props;
    const inputCombine = {};
    inputCombine.suffix = (<Icon type="search" onClick={onClick}/>);
    inputCombine.readOnly = true;
    Object.assign(inputCombine, inputAttrs);
    if (inputCombine.allowClear) {
        inputCombine.addonAfter = _renderClean(reference);
        if (undefined !== value) {
            inputCombine.className = "ux-readonly ux-addon-after";
        } else {
            inputCombine.className = "ux-readonly ux-addon-disabled";
        }
    } else {
        inputCombine.className = "ux-readonly";
    }
    return inputCombine;
}
export default {
    dialogCombine
};