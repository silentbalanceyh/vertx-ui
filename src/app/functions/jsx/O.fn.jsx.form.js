import Ex from "ex";
import Ux from "ux";
import {ExForm} from "ei";
import React from "react";

export default (reference) => {
    const formAttrs = Ex.yoAmbient(reference);
    const {$inited = {}} = reference.props;
    formAttrs.$inited = $inited;
    formAttrs.config = {form: Ux.fromHoc(reference, "form")};
    const {$refresh} = reference.state;
    if ($refresh) {
        formAttrs.$refresh = $refresh;
        console.error(formAttrs);
    }
    return (<ExForm {...formAttrs} $height={"160px"}/>)
}