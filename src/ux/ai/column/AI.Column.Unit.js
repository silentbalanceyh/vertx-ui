import {Button, DatePicker, Input, InputNumber, TreeSelect} from "antd";
import AiPure from "../AI.Pure";
import React from "react";
import Jsx from '../../Ux.Jsx';
import Aid from './AI.Column.Aid';
import Norm from '../../Ux.Normalize';
import Prop from '../../prop';
import U from 'underscore';

const jsxInput = (attrs = {}) => (<Input {...attrs}/>);

export default {
    // ---- ORIGIN
    ORIGIN: Aid.jsxConnect(
        (reference, params = {}, channel = {}) => {
            const attrs = Aid.initEmpty();
            Aid.onJsx(attrs, reference, params);
            Aid.onAllowClear(attrs, reference, params);
            channel.fnChange = Aid.onChangeUnit(attrs, reference, params);
            return attrs;
        },
        (attrs = {}, reference, params = {}, channel = {}) => {
            Aid.outDisabled(attrs, reference, params);
            attrs.value = params.text;
            attrs.onChange = channel.fnChange(params.index);
            Aid.outOrigin(attrs, reference, params);
        },
        (attrs = {}) => {
            const {items = [], ...rest} = attrs;
            return AiPure.aiInputSelect(items, rest);
        }
    ),
    // ---- DATUM
    DATUM: Aid.jsxConnect(
        (reference, params = {}, channel = {}) => {
            const attrs = Aid.initEmpty();
            Aid.onDatum(attrs, reference, params);
            Aid.onJsx(attrs, reference, params);
            Aid.onAllowClear(attrs, reference, params);
            channel.fnChange = Aid.onChangeUnit(attrs, reference, params);
            return attrs;
        },
        (attrs = {}, reference, params = {}, channel = {}) => {
            Aid.outDisabled(attrs, reference, params);
            attrs.value = params.text;
            attrs.onChange = channel.fnChange(params.index, params.record);
            Aid.outFilter(attrs, reference, params);
        },
        (attrs = {}) => {
            const {items = [], ...rest} = attrs;
            return AiPure.aiInputSelect(items, rest);
        }
    ),
    // ---- TREE
    TREE: Aid.jsxConnect(
        (reference, params = {}, channel = {}) => {
            const attrs = Aid.initEmpty();
            Aid.onTree(attrs, reference, params);
            channel.fnChange = Aid.onChangeUnit(attrs, reference, params);
            return attrs;
        },
        (attrs = {}, reference, params = {}, channel = {}) => {
            attrs.onChange = channel.fnChange(params.index);
            attrs.value = params.text;
        },
        (attrs = {}) => (<TreeSelect {...attrs}/>)
    ),
    // ---- VECTOR
    VECTOR: Aid.jsxConnect(
        (reference, params = {}) => {
            const attrs = Aid.initEmpty();
            Aid.onStyle(attrs, reference, params);
            return attrs;
        },
        (attrs = {}, reference, params = {}) => {
            Aid.outTo(attrs, reference, params);
        },
        Aid.jsxSpan,
    ),
    // ---- LABEL
    LABEL: Aid.jsxConnect(
        (reference, params = {}) => {
            const attrs = Aid.initEmpty();
            Aid.onStyle(attrs, reference, params);
            return attrs;
        },
        (attrs = {}, reference, params = {}) => {
            Aid.outSeq(attrs, reference, params);
        },
        Aid.jsxSpan,
    ),
    // ---- CURRENCY
    CURRENCY: Aid.jsxConnect(
        (reference, params = {}) => {
            const attrs = Aid.initEmpty();
            Aid.onStyle(attrs, reference, params);
            return attrs;
        },
        (attrs = {}, reference, params = {}) => {
            Aid.outCurrency(attrs, reference, params);
        },
        Aid.jsxSpan,
    ),
    // ---- 求乘积
    MULTIPLE: Aid.jsxConnect(
        (reference, params = {}) => {
            const attrs = Aid.initEmpty();
            Aid.onStyle(attrs, reference, params);
            return attrs;
        },
        (attrs = {}, reference, params = {}) => {
            Aid.outMultiple(attrs, reference, params);
        },
        Aid.jsxSpan,
    ),
    // ---- DATE
    DATE: Aid.jsxConnect(
        (reference, params = {}, channel = {}) => {
            const attrs = Aid.initConfig(params);
            channel.fnChange = Aid.onChangeUnit(attrs, reference, params);
            return attrs;
        },
        (attrs = {}, reference, params = {}, channel = {}) => {
            attrs.onChange = channel.fnChange(params.index);
            attrs.className = "ux-readonly";
            Aid.outDate(attrs, reference, params);
        },
        (attrs = {}) => (<DatePicker {...attrs}/>)
    ),
    // ---- TEXT
    TEXT: Aid.jsxConnect(
        (reference, params = {}, channel = {}) => {
            const attrs = Aid.initDynamic(params);
            channel.fnChange = Aid.onChangeUnit(attrs, reference, params);
            return attrs;
        },
        null,
        jsxInput
    ),
    // NUMBER
    NUMBER: Aid.jsxConnect(
        (reference, params = {}, channel = {}) => {
            const attrs = Aid.initDynamic(params);
            channel.fnChange = Aid.onChangeUnit(attrs, reference, params);
            return attrs;
        },
        null,
        (attrs = {}) => (<InputNumber {...attrs}/>),
    ),
    DECIMAL: Aid.jsxConnect(
        (reference, params = {}, channel = {}) => {
            const attrs = Aid.initDynamic(params);
            Aid.onUnit(attrs, reference, params);
            channel.fnChange = Aid.onChangeUnit(attrs, reference, {
                ...params, normalize: Norm.normalizer.decimal(18, 2)
            });
            return attrs;
        },
        null,
        jsxInput
    ),
    // ---- RADIO
    RADIO: Aid.jsxConnect(
        (reference, params = {}, channel = {}) => {
            const attrs = Aid.initConfig(params);
            Aid.onOptions(attrs, reference, params);
            channel.fnChange = Aid.onChangeUnit(attrs, reference, params);
            return attrs;
        },
        (attrs = {}, reference, params = {}, channel = {}) => {
            Aid.outDisabled(attrs, reference, params);
            attrs.value = params.text ? String(params.text) : params.text;
            attrs.onChange = channel.fnChange(params.index);
        },
        (attrs) => {
            const {items = [], ...rest} = attrs;
            return AiPure.aiInputRadio(items, rest);
        }
    ),
    // ---- INDEX_RADIO
    INDEX_RADIO: Aid.jsxConnect(
        (reference, params = {}, channel = {}) => {
            const attrs = Aid.initConfig(params);
            channel.fnChange = Aid.onChangeUnit(attrs, reference, params);
            return attrs;
        },
        (attrs = {}, reference, params = {}, channel = {}) => {
            Aid.outDisabled(attrs, reference, params);
            Aid.onIndexOptions(attrs, reference, params);
            attrs.value = params.text ? String(params.text) : params.text;
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
            Aid.onRows(attrs, reference, params);
            channel.fnChange = Aid.onChangeUnit(attrs, reference, params);
            return attrs;
        },
        null,
        (attrs = {}) => {
            const {value, ...rest} = attrs;
            return Jsx.jsxCell(Input.TextArea, rest, value);
        }
    ),

    // ---- TRIGGER_BUTTON, 用主界面中的state绑定函数处理按钮行为
    TRIGGER_BUTTON: Aid.jsxConnect(
        (reference, params = {}, channel = {}) => {
            const attrs = Aid.initDynamic(params);
            channel.button = Aid.onButton(attrs, reference, params);
            return attrs;
        },
        (attrs = {}, reference, params = {}, channel = {}) => {
            // channel中的text, trigger
            const {text, trigger} = channel.button;
            if (text) attrs.children = text;
            // 注入
            if (trigger) {
                const ref = Prop.onReference(reference, 1);
                const fn = ref.props[trigger];
                if (U.isFunction(fn)) {
                    attrs.onClick = fn(params.text, params.record);
                }
            }
        },
        (attrs = {}, children) => {
            return children ? (
                <Button {...attrs}>{children}</Button>
            ) : (<Button {...attrs}/>);
        }
    )
};