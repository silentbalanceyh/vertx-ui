import Cmn from "./I.common";
import Abs from "../../abyss";
import {Tooltip} from "antd";
import React from "react";
import './Cab.less';

export default (reference, config = {}) => {
    /*
     * -1. 风格可静态化
     */
    let attrs = Cmn.normalizeInit(config);
    attrs.reference = reference;
    return (text, record) => {
        attrs = Abs.clone(attrs);
        /*
         * 1.格式化文字
         **/
        let normalizedText = Cmn.normalizeText(text, config, record);
        let isPop = false;
        if (normalizedText) {
            /*
            * 2.带省略号文字专用处理
            */
            isPop = Cmn.normalizeOverflow(attrs, config);
        }
        return isPop ? (
            <Tooltip title={normalizedText}
                     overlayClassName={"web-tool-tip"}>
                {Cmn.jsxSpan(attrs, normalizedText)}
            </Tooltip>
        ) : Cmn.jsxSpan(attrs, normalizedText);
    }
}