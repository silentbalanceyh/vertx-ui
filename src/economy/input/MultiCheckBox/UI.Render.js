import {Checkbox} from "antd";
import React from "react";
import Op from './Op';

const renderChildren = (reference, prefix, item = {}) => {
    const {children = [], $value = [], horizon = false} = item;
    // 是否选中
    const fnVertical = (jsx) => (
        <span>
            <br/>{prefix ? `${prefix}：` : false}
            {jsx}
        </span>
    );
    const fnHorizon = (jsx) => (
        <span>{jsx}</span>
    );
    const jsx = (
        <Checkbox.Group onChange={Op.on2ChildChange(reference, item.key)}
                        value={$value}
                        disabled={item.disabled}>
            {children.map(child => (
                <span className={"web-check-col"} key={child.key}>
                        <Checkbox value={child.value}>
                            {child.label ? child.label : ""}
                        </Checkbox>
                    </span>
            ))}
        </Checkbox.Group>
    );
    return 0 < children.length ? (horizon ? fnHorizon(jsx) : fnVertical(jsx)) : false;
};
export default {
    renderChildren
};