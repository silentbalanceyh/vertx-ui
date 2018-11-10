import AiValue from "../expr/AI.Expr.Value";
import {DatePicker, Input, InputNumber, TreeSelect} from "antd";
import Value from "../../Ux.Value";
import AiExpr from "../expr/AI.Expr.String";
import AiPure from "../AI.Pure";
import RxAnt from '../ant/AI.RxAnt';
import Prop from '../../prop/Ux.Prop';
import React from "react";
import Xt from '../../xweb';
import Norm from '../../Ux.Normalize';
import Jsx from '../../Ux.Jsx';
import U from 'underscore';
import Aid from './AI.Column.Aid';

const _wrapperChild = (config = {}, record = {}, fnRender) => {
    // config中是否配置了childOnly
    if (config['childOnly']) {
        // 如果是childOnly则只有children = [] > 0 时渲染
        if (record.children && 0 < record.children.length) {
            return false;
        } else return U.isFunction(fnRender) ? fnRender() : false;
    } else return U.isFunction(fnRender) ? fnRender() : false;
};

const aiUnitVector = (reference, item = {}, jsx) => (text, record = {}) => {
    const config = item['$config'];
    let label = text;
    // 转换前提是包含了config.to的配置
    if (config && config.to) {
        label = record[config.to];
    }
    const attrs = {};
    attrs.style = jsx.style ? jsx.style : {};
    return (<span {...attrs}>{label}</span>);
};

const aiUnitLabel = (reference, column = {}, jsx) => {
    const attrs = Aid.initEmpty();
    // jsx.style
    Aid.onStyle(attrs, reference, {jsx, column});
    return (text) => {
        // $config.mode
        Aid.outSeq(attrs, reference, {jsx, column, text});
        // 最终输出
        const {children, ...rest} = attrs;
        return (<span {...rest}>{children}</span>);
    };
};

const aiUnitText = (reference, column = {}, jsx = {}) => {
    const attrs = Aid.initDynamic(column);
    // 2阶变更函数
    const on2Change = Aid.onChangeUnit(attrs, reference, {column});
    return (text, record = {}, index) => {
        // 2阶变更 -> 一阶变更
        attrs.onChange = on2Change(index);
        // jsx.readOnly
        Aid.outReadOnly(attrs, reference, {jsx, column});
        // 支持Child
        return Aid.jsxChild(column, record,
            () => <Input {...attrs} value={text}/>);
    };
};

const aiUnitTextArea = (reference, item = {}, jsx = {}) => (text, record = {}, index) => {
    // add by Hongwei: 添加对rows属性的支持
    const config = item["$config"] ? item["$config"] : {};
    const rows = config ? config["rows"] : 2;
    const attrs = AiValue.applyDynamic(item);
    // 处理属性相关信息
    const {readOnly = false} = jsx;
    attrs.readOnly = readOnly;
    const params = {
        index, field: item.dataIndex
    };
    attrs.onChange = Xt.xt2ChangeUnit(reference, params);
    attrs.rows = rows;
    // 进行协变的渲染
    return Jsx.jsxCell(Input.TextArea, attrs, text);
};

const aiUnitNumber = (reference, item = {}, jsx = {}) => (text, record = {}, index) => {
    const attrs = AiValue.applyDynamic(item);
    // 处理属性相关信息
    const {readOnly = false} = jsx;
    attrs.readOnly = readOnly;
    const params = {
        index, field: item.dataIndex
    };
    attrs.onChange = Xt.xt2ChangeUnit(reference, params);
    return (<InputNumber {...attrs} value={text}/>);
};

const aiUnitDecimal = (reference, item = {}, jsx = {}) => (text, record = {}, index) => {
    const attrs = AiValue.applyDynamic(item);
    // 只读处理
    const {viewOnly = false} = jsx;
    attrs.readOnly = viewOnly;
    // 单位处理
    const {$config = {}} = item;
    if ($config.unit)
        attrs.addonAfter = $config.unit;
    // 变更函数
    const params = {
        index, field: item.dataIndex,
        // 格式化专用
        normalize: Norm.normalizer.decimal(18, 2)
    };
    attrs.onChange = Xt.xt2ChangeUnit(reference, params);
    return (<Input {...attrs} value={text}/>);
};

const aiUnitDate = (reference, item) => (text, record, index) => {
    const config = item["$config"] ? item["$config"] : {};
    const attrs = Object.assign({}, config);
    if (text) {
        attrs.value = Value.convertTime(text);
    }
    attrs.className = "rx-readonly";
    const params = {
        index, field: item.dataIndex,
    };
    attrs.onChange = Xt.xt2ChangeUnit(reference, params);
    return (<DatePicker {...attrs}/>);
};

const aiUnitRadio = (reference, item = {}, jsx = {}) => (text, record, index) => {
    const config = item["$config"] ? item["$config"] : {};
    config.items = AiExpr.aiExprOption(config.items);
    if (jsx.readOnly) {
        config.disabled = jsx.readOnly;
    }
    const params = {
        index, field: item.dataIndex,
    };
    config.onChange = Xt.xt2ChangeUnit(reference, params);
    const {items = [], ...rest} = config;
    return AiPure.aiInputRadio(items, {...rest, value: String(text)});
};
const aiUnitDatum = (reference, item = {}, jsx = {}) => (text, record, index) => {
    const config = item['$config'];
    const {datum} = config;
    let items = [];
    if (datum) {
        const ref = Prop.onReference(reference, 1);
        items = RxAnt.toOptions(ref, {datum});
    } else {
        items = RxAnt.toOptions(reference, {items: config.items});
    }
    const unitJsx = item.jsx ? item.jsx : {};
    let attrs = {};
    attrs = Object.assign(attrs, unitJsx);
    attrs.value = text;
    const params = {
        index, field: item.dataIndex,
    };
    attrs.onChange = Xt.xt2ChangeUnit(reference, params);
    // 允许清空
    if (config.hasOwnProperty('allowClear')) {
        attrs.allowClear = config.allowClear;
    }
    // 处理childOnly的渲染模式
    console.info(attrs, items);
    return _wrapperChild(config, record,
        () => AiPure.aiInputSelect(items, attrs));
};

const aiUnitTree = (reference, item = {}, jsx = {}) => (text, record, index) => {
    const config = item['$config'];
    let treeData = [];
    if (config.datum) {
        const ref = Prop.onReference(reference, 1);
        treeData = RxAnt.toTreeOptions(ref, config);
    }
    const params = {
        index, field: item.dataIndex,
    };
    const attrs = {};
    attrs.onChange = Xt.xt2ChangeUnit(reference, params);
    attrs.treeData = treeData;
    return (<TreeSelect {...attrs} value={text}/>);
};

export default {
    VECTOR: aiUnitVector,
    TEXT: aiUnitText,
    TEXT_AREA: aiUnitTextArea,
    DATE: aiUnitDate,
    DATUM: aiUnitDatum,
    RADIO: aiUnitRadio,
    LABEL: aiUnitLabel,
    NUMBER: aiUnitNumber,
    DECIMAL: aiUnitDecimal,
    TREE: aiUnitTree
};