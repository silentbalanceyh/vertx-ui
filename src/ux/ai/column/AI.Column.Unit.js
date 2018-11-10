import {DatePicker, Input, InputNumber, TreeSelect} from "antd";
import AiPure from "../AI.Pure";
import RxAnt from '../ant/AI.RxAnt';
import Prop from '../../prop/Ux.Prop';
import React from "react";
import Xt from '../../xweb';
import Jsx from '../../Ux.Jsx';
import U from 'underscore';
import Aid from './AI.Column.Aid';
import Value from '../../value';
import Norm from '../../Ux.Normalize';

const _wrapperChild = (config = {}, record = {}, fnRender) => {
    // config中是否配置了childOnly
    if (config['childOnly']) {
        // 如果是childOnly则只有children = [] > 0 时渲染
        if (record.children && 0 < record.children.length) {
            return false;
        } else return U.isFunction(fnRender) ? fnRender() : false;
    } else return U.isFunction(fnRender) ? fnRender() : false;
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

const jsxLabel = (attrs = {}, children) => (<span {...attrs}>{children}</span>);
const jsxInput = (attrs = {}) => (<Input {...attrs}/>);

export default {

    // TEXT_AREA: aiUnitTextArea,
    // DATE: aiUnitDate,
    DATUM: aiUnitDatum,
    TREE: aiUnitTree,
    // ---- VECTOR
    VECTOR: Aid.jsxConnect(
        (reference, params = {}) => {
            const attrs = Aid.initEmpty();
            // jsx.style
            Aid.onStyle(attrs, reference, params);
            return attrs;
        },
        (attrs = {}, reference, params = {}) => {
            // 设置to
            Aid.outTo(attrs, reference, params);
        },
        jsxLabel
    ),
    // ---- LABEL
    LABEL: Aid.jsxConnect(
        (reference, params = {}) => {
            const attrs = Aid.initEmpty();
            // jsx.style
            Aid.onStyle(attrs, reference, params);
            // 记得返回
            return attrs;
        },
        (attrs = {}, reference, params = {}) => {
            // $config.mode,
            Aid.outSeq(attrs, reference, params);
        },
        jsxLabel
    ),
    // ---- DATE
    DATE: Aid.jsxConnect(
        (reference, params = {}, channel = {}) => {
            const attrs = Aid.initConfig(params);
            // 穿透函数，获取2阶变更
            channel.fnChange = Aid.onChangeUnit(attrs, reference, params);
            return attrs;
        },
        (attrs = {}, reference, params = {}, channel = {}) => {
            // 2阶变更 -> 一阶变更
            attrs.onChange = channel.fnChange(params.index);
            // 专用日期处理
            attrs.className = "rx-readonly";
            let value = params.text;
            if (value) {
                attrs.value = Value.convertTime(value);
            } else {
                attrs.value = null;
            }
        },
        (attrs = {}) => (<DatePicker {...attrs}/>)
    ),
    // ---- TEXT
    TEXT: Aid.jsxConnect(
        (reference, params = {}, channel = {}) => {
            const attrs = Aid.initDynamic(params);
            // 穿透函数，获取2阶变更
            channel.fnChange = Aid.onChangeUnit(attrs, reference, params);
            return attrs;
        },
        (attrs = {}, reference, params = {}, channel = {}) => {
            // 2阶变更 -> 一阶变更
            attrs.onChange = channel.fnChange(params.index);
            // jsx.readOnly
            Aid.outReadOnly(attrs, reference, params);
            // 设置值，直接用 = 赋值
            attrs.value = params.text;
        },
        jsxInput
    ),
    // NUMBER
    NUMBER: Aid.jsxConnect(
        (reference, params = {}, channel = {}) => {
            const attrs = Aid.initDynamic(params);
            // 穿透函数，获取2阶变更
            channel.fnChange = Aid.onChangeUnit(attrs, reference, params);
            return attrs;
        },
        (attrs = {}, reference, params = {}, channel = {}) => {
            // 2阶变更 -> 一阶变更
            attrs.onChange = channel.fnChange(params.index);
            // jsx.readOnly
            Aid.outReadOnly(attrs, reference, params);
            // 设置值，直接用 = 赋值
            attrs.value = params.text;
        },
        (attrs = {}) => (<InputNumber {...attrs}/>),
    ),
    DECIMAL: Aid.jsxConnect(
        (reference, params = {}, channel = {}) => {
            const attrs = Aid.initDynamic(params);
            Aid.onUnit(attrs, reference, params);
            // 穿透函数，获取2阶变更
            channel.fnChange = Aid.onChangeUnit(attrs, reference, {
                ...params, normalize: Norm.normalizer.decimal(18, 2)
            });
            return attrs;
        },
        (attrs = {}, reference, params = {}, channel = {}) => {
            // 2阶变更 -> 一阶变更
            attrs.onChange = channel.fnChange(params.index);
            // jsx.readOnly
            Aid.outReadOnly(attrs, reference, params);
            // 设置值
            attrs.value = params.text;
        },
        jsxInput
    ),
    // ---- RADIO
    RADIO: Aid.jsxConnect(
        (reference, params = {}, channel = {}) => {
            const attrs = Aid.initConfig(params);
            // items
            Aid.onOptions(attrs, reference, params);
            // 获取二阶穿透函数
            channel.fnChange = Aid.onChangeUnit(attrs, reference, params);
            return attrs;
        },
        (attrs = {}, reference, params = {}, channel = {}) => {
            // 设置disabled
            Aid.outDisabled(attrs, reference, params);
            // 设置值，直接用 = 赋值
            attrs.value = params.text ? String(params.text) : params.text;
            // 2阶变更 -> 一阶变更
            attrs.onChange = channel.fnChange(params.index);
        },
        (attrs) => {
            const {items = [], ...rest} = attrs;
            return AiPure.aiInputRadio(items, rest);
        }
    ),

    // ---- TEXT_AREA
    TEXT_AREA: Aid.jsxConnect(
        (reference, params = {}, channel = {}) => {
            const attrs = Aid.initDynamic(params);
            // 挂载rows
            Aid.onRows(attrs, reference, params);
            // 获取二阶穿透函数
            channel.fnChange = Aid.onChangeUnit(attrs, reference, params);
            return attrs;
        },
        (attrs = {}, reference, params = {}, channel = {}) => {
            // readOnly
            Aid.outReadOnly(attrs, reference, params);
            // 设置值，直接使用
            attrs.value = params.text;
            // 2阶变更 -> 一阶变更
            attrs.onChange = channel.fnChange(params.index);
        },
        (attrs = {}) => {
            const {value, ...rest} = attrs;
            return Jsx.jsxCell(Input.TextArea, rest, value);
        }
    ),
};