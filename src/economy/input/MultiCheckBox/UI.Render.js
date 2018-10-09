import {Checkbox} from "antd";
import React from "react";
import Op from './Op';

const renderChildren = (reference, prefix, item = {}) => {
    const {children = [], $value = []} = item;
    // 是否选中
    return 0 < children.length ? (
        <span><br/>{prefix}：
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
        </span>
    ) : false;
};
export default {
    renderChildren
};