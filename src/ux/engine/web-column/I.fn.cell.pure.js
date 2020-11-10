import React from 'react';
import Abs from '../../abyss';
import Highlighter from "react-highlight-words";
import Cmn from './I.common';

export default (reference, config = {}) => {
    /*
     * -1. 风格可静态化
     */
    let attrs = Cmn.normalizeInit(config);
    return (text, record = {}) => {
        attrs = Abs.clone(attrs);
        /*
         * 1.格式化文字
         */
        const normalizedText = Cmn.normalizeText(text, config, record);
        /*
         * 2.执行 highlight 专用处理
         */
        if (config.highlight) {
            /*
             * 支持 $filter 的专用搜索高亮处理
             */
            const {$keyword = {}} = reference.state ? reference.state : {};
            const words = Object.keys($keyword)
                .filter(cond => cond.startsWith(config.dataIndex))
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
            return Cmn.jsxSpan(attrs, normalizedText, config);
        }
    }
}