import {Breadcrumb} from "antd";
import React from "react";
import Unit from "../web-unit";

const aiBreadcrumb = (items = [], rest = {}, addOn = {}) => (
    <Breadcrumb {...rest}>
        {items.map(item => (
            <Breadcrumb.Item key={item.key}>
                {Unit.aiLink(item, addOn)}
            </Breadcrumb.Item>
        ))}
    </Breadcrumb>
);
export default {
    aiBreadcrumb
}