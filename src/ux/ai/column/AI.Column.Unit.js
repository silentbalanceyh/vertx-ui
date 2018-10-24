import AiValue from "../expr/AI.Expr.Value";
import {DatePicker, Input, TreeSelect} from "antd";
import Value from "../../Ux.Value";
import AiExpr from "../expr/AI.Expr.String";
import AiPure from "../AI.Pure";
import RxAnt from '../ant/AI.RxAnt';
import Prop from '../../prop/Ux.Prop';
import React from "react";
import Xt from '../../xweb';
import Norm from '../../Ux.Normalize';
import Jsx from '../../Ux.Jsx';

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

const aiUnitLabel = (reference, item = {}, jsx) => (text) => {
    const attrs = {};
    attrs.style = jsx.style ? jsx.style : {};
    return ((<span {...attrs}>{text}</span>));
};

const aiUnitText = (reference, item = {}, jsx = {}) => (text, record = {}, index) => {
    const attrs = AiValue.applyDynamic(item);
    // 处理属性相关信息
    const {viewOnly = false} = jsx;
    attrs.readOnly = viewOnly;
    const params = {
        index, field: item.dataIndex
    };
    attrs.onChange = Xt.xt2ChangeUnit(reference, params);
    return (<Input {...attrs} value={text}/>);
};

const aiUnitTextArea = (reference, item = {}, jsx = {}) => (text, record = {}, index) => {
    // add by Hongwei: 添加对rows属性的支持
    const config = item["$config"] ? item["$config"] : {};
    const rows = config ? config["rows"] : 2;
    const attrs = AiValue.applyDynamic(item);
    // 处理属性相关信息
    const {viewOnly = false} = jsx;
    attrs.readOnly = viewOnly;
    const params = {
        index, field: item.dataIndex
    };
    attrs.onChange = Xt.xt2ChangeUnit(reference, params);
    attrs.rows = rows;
    // 进行协变的渲染
    return Jsx.jsxCell(Input.TextArea, attrs, text);
};

const aiUnitDecimal = (reference, item = {}, jsx = {}) => (text, record = {}, index) => {
    const attrs = AiValue.applyDynamic(item);
    // 只读处理
    const {viewOnly = false} = jsx;
    attrs.readOnly = viewOnly;
    // 单位处理
    const {$config = {}} = item;
    attrs.addonAfter = $config.unit ? $config.unit : "￥";
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
    if (jsx['viewOnly']) {
        config.disabled = jsx['viewOnly'];
        config.className = "web-radio-view";
    }
    const params = {
        index, field: item.dataIndex,
    };
    config.onChange = Xt.xt2ChangeUnit(reference, params);
    const {items = [], ...rest} = config;
    return AiPure.aiInputRadio(items, {...rest, value: String(text)});
};

const aiUnitDatum = (reference, item = {}, jsx = {}) => (text, record, index) => {
    const datum = item["$config"].datum;
    let items = [];
    if (datum) {
        const ref = Prop.onReference(reference, 1);
        items = RxAnt.toOptions(ref, {datum});
    }
    const unitJsx = item.jsx ? item.jsx : {};
    let attrs = {};
    attrs = Object.assign(attrs, unitJsx);
    attrs.value = text;
    const params = {
        index, field: item.dataIndex,
    };
    attrs.onChange = Xt.xt2ChangeUnit(reference, params);
    return AiPure.aiInputSelect(items, attrs);
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
    DECIMAL: aiUnitDecimal,
    TREE: aiUnitTree
};