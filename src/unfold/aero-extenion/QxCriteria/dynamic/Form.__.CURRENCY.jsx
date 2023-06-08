import Ux from "ux";
import {InputNumber} from "antd";
import React from "react";

const rxInput = (reference) => (event) => {
    let {$waiting = {}} = reference.state;
    $waiting = Ux.clone($waiting);
    const current = Ux.ambEvent(event);
    if (isNaN(current)) {
        $waiting.value = Ux.valueFloat(current, 0.0);
    } else {
        $waiting.value = current;
    }
    $waiting.__value = current;
    Ux.of(reference).in({$waiting}).done();
    // reference.?etState({$waiting});
}
export default (reference) => {
    const {$waiting = {}} = reference.state;
    return (
        <div className={"dynamic"}>
            <InputNumber value={$waiting.__value}
                         min={0}
                         precision={2}
                         onChange={rxInput(reference)}/>
        </div>
    );
}