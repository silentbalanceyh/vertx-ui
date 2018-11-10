import fieldRender from "../../jsx/Ux.Jsx.Single";
import React from "react";
import {Icon} from "antd";
import CellOp from './AI.Column.Op';
import Aid from './AI.Column.Aid';
import U from 'underscore';
import Type from '../../Ux.Type';
import Value from '../../Ux.Value';

const aiCellDownload = (reference, config) => (text) => {
    // TODO:
    let downloadConfig = config["$download"];
    if (!downloadConfig) downloadConfig = {};
    return (<a href={text}>{downloadConfig.flag ? downloadConfig.flag : text}</a>);
};
const initEmpty = () => {
    const attrs = Aid.initEmpty();
    return attrs;
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
                attrs.children = result.map(item => Value.valueExpr(display, item)).join(',');
            } else {
                const item = Type.elementUnique(data, config.value, text);
                attrs.children = item ? Value.valueExpr(display, item) : false
            }
        },
        Aid.jsxSpan,
    ),
    DOWNLOAD: aiCellDownload,
    ...CellOp,
};