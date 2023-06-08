import {Radio} from "antd";
import React from "react";
import Ux from "ux";

const rxInput = (reference) => (event) => {
    let {$waiting = {}} = reference.state;
    const $updated = Ux.clone($waiting);
    const value = Ux.ambEvent(event);
    /*
     * 逻辑条件转换成下边格式
     * "field,i": [true,false]
     */
    $updated.value = ["true" === value];
    $updated.op = "i";
    $updated.__op = $waiting.op;
    $updated.__value = value;
    Ux.of(reference).in({$waiting: $updated}).done();
}
export default (reference, configuration = {}) => {
    const {$waiting = {}} = reference.state;
    const {item = {}} = configuration;
    const {mapping = {}} = item.config ? item.config : {};
    return (
        <Radio.Group value={$waiting.__value}
                     onChange={rxInput(reference)}>
            <Radio value={"true"}>{mapping[true]}</Radio>
            <Radio value={"false"}>{mapping[false]}</Radio>
        </Radio.Group>
    )
}