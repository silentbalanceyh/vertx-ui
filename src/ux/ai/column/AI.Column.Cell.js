import fieldRender from "../../jsx/Ux.Jsx.Single";
import React from "react";
import {Icon} from "antd";
import CellOp from './AI.Column.Op';
import Aid from './AI.Column.Aid';
import U from 'underscore';
import Type from '../../Ux.Type';
import Value from '../../Ux.Value';
import Util from '../../util';
import Ajax from '../../ajax/Ux.Ajax';
import {saveAs} from "file-saver";

const _aiCellSingle = (reference, config, text) => {
    let downloadConfig = config["$download"];
    if (!downloadConfig) downloadConfig = {};
    const value = {value: text.key, name: text.name ? text.name : Util.randomUUID()};
    return (<a href={value.name} onClick={(event) => {
        event.preventDefault();
        const link = Util.formatExpr(downloadConfig.ajax, value);
        Ajax.ajaxDownload(link, value, {})
            .then(data => saveAs(data, value.name));
    }}>{downloadConfig.flag ? downloadConfig.flag : value.name}</a>);
};

const aiCellDownload = (reference, config) => (text) => {
    // 上传时作了序列化，所以下载时要做反向处理
    text = JSON.parse(text);
    if (U.isArray(text)) {
        return (
            <ul>
                {text.map(each => <li>{_aiCellSingle(reference, config, each)}</li>)}
            </ul>
        );
    } else return _aiCellSingle(reference, config, text);
};
const initEmpty = () => {
    return Aid.initEmpty();
};
export default {
    // ---- LOGICAL
    LOGICAL: Aid.jsxConnect(
        initEmpty,
        Aid.cellLogical,
        (attrs = {}) => fieldRender.jsxIcon(attrs)
    ),
    PERCENT: Aid.jsxConnect(
        initEmpty,
        Aid.cellPercent,
        Aid.jsxSpan,
    ),
    DATE: Aid.jsxConnect(
        initEmpty,
        Aid.cellDate,
        Aid.jsxSpan,
    ),
    CURRENCY: Aid.jsxConnect(
        initEmpty,
        Aid.cellCurrency,
        Aid.jsxSpan,
    ),
    EXPRESSION: Aid.jsxConnect(
        initEmpty,
        Aid.cellExpr,
        Aid.jsxSpan,
    ),
    MAPPING: Aid.jsxConnect(
        initEmpty,
        Aid.cellMapping,
        (attrs = {}, children = {}) => attrs.icon ?
            fieldRender.jsxIcon(attrs.icon) :
            Aid.jsxSpan(attrs, children)
    ),
    ICON: Aid.jsxConnect(
        initEmpty,
        Aid.cellIcon,
        (attrs = {}, children = "") => (
            <span>
                {attrs.icon ? <Icon style={attrs.style} type={attrs.icon}/> : false}
                {attrs.icon ? <span>&nbsp;&nbsp;</span> : false}
                {children}
            </span>
        )
    ),
    DATUM: Aid.jsxConnect(
        (reference, params = {}) => {
            const attrs = Aid.initEmpty();
            Aid.onList(attrs, reference, params);
            return attrs;
        },
        (attrs = {}, reference, params = {}) => {
            const {text} = params;
            const {list: {data = [], config = {}, display = ""}} = attrs;
            if (U.isArray(text)) {
                const result = [];
                text.forEach(each => result.push(Type.elementUnique(data, config.value, each)));
                attrs.children = result.map(item => Value.valueExpr(display, item, true)).join(',');
            } else {
                const item = Type.elementUnique(data, config.value, text);
                attrs.children = item ? Value.valueExpr(display, item, true) : false;
            }
        },
        Aid.jsxSpan,
    ),
    DOWNLOAD: aiCellDownload,
    ...CellOp,
};