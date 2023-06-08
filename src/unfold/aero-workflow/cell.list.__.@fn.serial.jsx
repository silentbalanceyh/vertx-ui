import Ux from "ux";
import {Tooltip} from "antd";
import React from "react";

export default (reference) => (inherit = {}) => {
    const {data = {}, config = {}} = inherit;
    const {prefix = ""} = config;
    const title = Ux.formatExpr(prefix, data, true);
    return (
        <span className={"ex-workflow-serial"}>
                {data.serial}
            &nbsp;
            <Tooltip title={title} overlayClassName={"ex-workflow-tooltip"}>
                {Ux.v4Icon("link")}
            </Tooltip>
        </span>
    );
}