import __Zn from './zero.uca.dependency';
import __JSX from './column.__.fn.jsx.segment';
import __NORM from './column.__.fn.norm.text';
import {Tooltip} from "antd";
import React from 'react';

const Cv = __Zn.Env;
const Cmn = {
    ...__JSX,
    ...__NORM,
}
export default {
    HYPERLINK: (reference, column) => {
        let attrs = Cmn.normInit(column);                                          // -1. 风格可静态化
        attrs.reference = reference;                                                    // -2. 必须删除 $expr
        return (text, record) => {
            attrs = __Zn.clone(attrs);
            let normalizedText = Cmn.normText(text, column, record);               // 1.格式化文字
            let isPop = false;
            if (normalizedText) {
                const $config = column[Cv.K_NAME.CONFIG] ? column[Cv.K_NAME.CONFIG] : {};             // 2.链接专用处理
                if ($config.url) {
                    attrs.url = __Zn.formatExpr($config.url, record, true);
                }
                isPop = Cmn.normOverflow(attrs, column);                           // 3.Overflow
            }
            return isPop ? (
                <Tooltip title={normalizedText}
                         overlayClassName={"web-tool-tip"}>
                    {Cmn.jsxHyper(attrs, normalizedText)}
                </Tooltip>
            ) : Cmn.jsxHyper(attrs, normalizedText);
        }
    },
}