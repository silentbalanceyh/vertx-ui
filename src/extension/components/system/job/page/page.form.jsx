import Ex from "ex";
import Event from "../event";
import Form from "../form/UI.Form";
import React from "react";

export default (reference, item, $inited = {}) => {
    const inherit = Ex.yoAmbient(reference);
    inherit.$inited = $inited;
    inherit.rxClose = Event.rxTabClose(reference, item);
    return (
        <Form {...inherit}/>
    )
}