import __Zn from './zero.uca.dependency';
import __JSX from './column.__.fn.jsx.segment';
import __NORM from './column.__.fn.norm.text';
import React from 'react';
import {Tooltip} from "antd";

const Cmn = {
    ...__JSX,
    ...__NORM,
}
export default {
    TEXT: (reference, column = {}) => {
        let attrs = Cmn.normInit(column);                                          // -1. 风格可静态化
        attrs.reference = reference;
        return (text, record) => {
            attrs = __Zn.clone(attrs);
            let normalizedText = Cmn.normText(text, column, record);               // 1.格式化文字
            let isPop = false;
            if (normalizedText) {
                isPop = Cmn.normOverflow(attrs, column);                           // 2.带省略号文字专用处理
            }
            return isPop ? (
                <Tooltip title={normalizedText}
                         overlayClassName={"web-tool-tip"}>
                    {Cmn.jsxSpan(attrs, normalizedText)}
                </Tooltip>
            ) : Cmn.jsxSpan(attrs, normalizedText);
        }
    }
}