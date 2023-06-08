import Ux from "ux";
import {Input} from "antd";
import React from "react";

const rxInput = (reference) => (event) => {
    let {$waiting = {}} = reference.state;
    $waiting = Ux.clone($waiting);
    $waiting.value = Ux.ambEvent(event);
    Ux.of(reference).in({$waiting}).done();
    // reference.?etState({$waiting});
}
const attrAddon = (configuration) => {
    const {item = {}} = configuration;
    const {expression = {}} = item.config ? item.config : {};
    const attr = {};
    if (expression.before) {
        attr.addonBefore = expression.before;
    }
    if (expression.after) {
        attr.addonAfter = expression.after;
    }
    return attr;
}
export default (reference, configuration = {}) => {
    const {$waiting = {}} = reference.state;
    const {info = {}} = configuration.config;
    const {hint = {}} = info;
    const attrs = attrAddon(configuration);
    return (
        <div className={"dynamic"}>
            <Input placeholder={hint['TEXT']}
                   value={$waiting.value}
                   {...attrs}
                   onChange={rxInput(reference)}/>
        </div>
    )
}