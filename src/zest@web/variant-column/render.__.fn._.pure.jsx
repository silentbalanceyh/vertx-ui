import __Zn from './zero.uca.dependency';
import __JSX from './column.__.fn.jsx.segment';
import __NORM from './column.__.fn.norm.text';
import React from 'react';
import Highlighter from "react-highlight-words";

const Cmn = {
    ...__JSX,
    ...__NORM,
}
export default {
    PURE: (reference, column = {}) => {
        let attrs = Cmn.normInit(column);                                          // -1. 风格可静态化
        return (text, record = {}) => {
            attrs = __Zn.clone(attrs);
            const normalizedText = Cmn.normText(text, column, record);             // 1.格式化文字
            if (column.highlight) {                                                     // 2.执行 highlight 专用处理
                const {$keyword = {}} = reference.state ? reference.state : {};         // 支持 $filter 的专用搜索高亮处理
                const words = Object.keys($keyword)
                    .filter(cond => cond.startsWith(column.dataIndex))
                    .map(cond => $keyword[cond]);
                return (
                    <Highlighter
                        highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                        searchWords={words}
                        autoEscape
                        textToHighlight={normalizedText ? normalizedText.toString() : ""}
                    />
                );
            } else {
                return Cmn.jsxSpan(attrs, normalizedText, column);
            }
        }
    },
}