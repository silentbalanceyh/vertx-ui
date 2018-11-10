import Value from "../../Ux.Value";
import fieldRender from "../../jsx/Ux.Jsx.Single";
import RxAnt from "../ant/AI.RxAnt";
import Prop from "../../prop/Ux.Prop";
import Type from "../../Ux.Type";
import React from "react";
import {Icon} from "antd";
import U from 'underscore';
import CellOp from './AI.Column.Op';
import Aid from './AI.Column.Aid';

/**
 * 【高阶函数：二阶】列render方法处理函数，用于处理Datum类型：Tabular/Assist专用格式化
 * * 配置项：DATUM
 * * 附加配置项：$datum用于描述关联的信息，source = key, value和display对应值和呈现字段
 * @method aiCellDatum
 * @private
 * @param {React.PureComponent} reference React对应组件引用
 * @param {Object} config 单列配置数据
 * @return {function(*=): *}
 * @example
 *
 *      ...
 *      {
 *          "title": "会计科目",
 *          "dataIndex": "accountId",
 *          "$render": "DATUM",
 *          "$datum": {
 *              "source": "account.item",
 *              "value": "category",
 *              "display": "name"
 *          }
 *      }
 */
const aiCellDatum = (reference, config) => text => {
    const $datum = config['$datum'];
    const datum = "string" === typeof $datum ? RxAnt.toParsed($datum) : $datum;
    // 兼容处理，label优先，display次之
    let display = null;
    if (datum.label) {
        display = datum.label;
    } else {
        display = datum.display;
    }
    const data = Prop.onDatum(reference, datum.source);
    if (U.isArray(text)) {
        const result = [];
        text.forEach(each => result.push(Type.elementUnique(data, datum.value, each)));
        return (
            <span>{result.map(item => Value.valueExpr(display, item)).join('，')}</span>);
    } else {
        const item = Type.elementUnique(data, datum.value, text);
        return <span>{item ? Value.valueExpr(display, item) : false}</span>;
    }
};
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
    DATUM: aiCellDatum,
    DOWNLOAD: aiCellDownload,
    ...CellOp,
};