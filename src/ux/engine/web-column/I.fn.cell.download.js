import React from "react";
import U from 'underscore';
import Ut from '../../unity';
import Ajax from '../../ajax';
import {saveAs} from "file-saver";

const aiDownload = (reference, config, text) => {
    let downloadConfig = config["$download"];
    if (!downloadConfig) downloadConfig = {};
    const value = {value: text.key, name: text.name ? text.name : Ut.randomUUID()};
    return (<a href={value.name} onClick={(event) => {
        event.preventDefault();
        const link = Ut.formatExpr(downloadConfig.ajax, value);
        Ajax.ajaxDownload(link, value, {})
            .then(data => saveAs(data, value.name));
    }}>{downloadConfig.flag ? downloadConfig.flag : value.name}</a>);
};

export default (reference, config) => (text, record) => {
// 上传时作了序列化，所以下载时要做反向处理
    text = JSON.parse(text);
    if (U.isArray(text)) {
        return (
            <ul>
                {text.map(each => <li>{aiDownload(reference, config, each)}</li>)}
            </ul>
        );
    } else return aiDownload(reference, config, text);
}