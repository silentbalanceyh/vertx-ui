import Ux from "ux";
import {DatePicker} from "antd";
import React from "react";

const rxInput = (reference, format) => (event) => {
    let {$waiting = {}} = reference.state;
    $waiting = Ux.clone($waiting);
    const current = Ux.ambEvent(event);
    $waiting.value = current.format(format);
    $waiting.__value = current;
    Ux.of(reference).in({$waiting}).done();
    // reference.?etState({$waiting});
}
export default (reference, configuration = {}) => {
    const {$waiting = {}} = reference.state;
    const {item = {}} = configuration;
    const {format = "YYYY/MM/DD"} = item.config;
    return (
        <DatePicker format={format} className={"ux_readonly"}
                    value={$waiting.__value}
                    onChange={rxInput(reference, format)}/>
    )
}