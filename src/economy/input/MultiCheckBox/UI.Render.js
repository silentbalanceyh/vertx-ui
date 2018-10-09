import {Checkbox} from "antd";
import React from "react";
import Op from './Op';

const renderChildren = (reference, prefix, children = []) => {
    return 0 < children.length ? (
        <span><br/>{prefix}：
            <Checkbox.Group onChange={Op.on2ChildChange(reference)}>
                {children.map(child => (
                    <span className={"web-check-col"} key={child.key}>
                        <Checkbox value={child.value}>
                            {child.label ? child.label : ""}
                        </Checkbox>
                    </span>
                ))}
            </Checkbox.Group>
        </span>
    ) : false;
};
export default {
    renderChildren
};