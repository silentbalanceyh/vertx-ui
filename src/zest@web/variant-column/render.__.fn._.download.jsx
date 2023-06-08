import __Zn from './zero.uca.dependency';
import __JSX from './column.__.fn.jsx.segment';
import __NORM from './column.__.fn.norm.text';
import {saveAs} from "file-saver";
import React from 'react';

const Cmn = {
    ...__JSX,
    ...__NORM,
}
export default {
    DOWNLOAD: (reference, column) => {
        let attrs = Cmn.normInit(column);                                          // -1. 风格可静态化
        if (column['$expr']) delete column['$expr'];                                    // -2. 必须删除 $expr
        return (text, record) => {
            attrs = __Zn.clone(attrs);
            let normalizedText = Cmn.normText(text, column, record);               // 1.格式化文字
            const $config = column['$config'];
            return (
                // eslint-disable-next-line
                <a href={""} onClick={event => {
                    __Zn.prevent(event);
                    const {uri = ""} = $config.ajax ? $config.ajax : {}
                    const link = __Zn.formatExpr(uri, record, true);
                    const value = {value: record.key, name: text}
                    __Zn.ajaxDownload(link, value, {})
                        .then(data => saveAs(data, value.name));
                }}>{Cmn.jsxSpan(attrs, normalizedText)}</a>
            );
        }
    },
}