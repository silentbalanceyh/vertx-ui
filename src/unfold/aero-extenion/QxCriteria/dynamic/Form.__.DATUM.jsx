import Ux from "ux";
import {Select} from "antd";
import React from "react";

const rxInput = (reference) => (event) => {
    let {$waiting = {}} = reference.state;
    $waiting = Ux.clone($waiting);
    $waiting.value = Ux.ambEvent(event);
    Ux.of(reference).in({$waiting}).done();
    // reference.?etState({$waiting});
}
export default (reference, configuration = {}) => {
    const {$waiting = {}} = reference.state;
    const {item = {}} = configuration;
    const {options = []} = item.config ? item.config : {}
    const attrs = {};
    if (["i", "!i"].includes($waiting.op)) {
        attrs.mode = "multiple";
    }
    return (
        <div className={"dynamic"}>
            <Select {...attrs} style={{width: "100%"}} value={$waiting.value}
                    onChange={rxInput(reference)}>
                {options.map(option => (
                    <Select.Option key={option.key} value={option.value}>
                        {option.label}
                    </Select.Option>
                ))}
            </Select>
        </div>
    )
}