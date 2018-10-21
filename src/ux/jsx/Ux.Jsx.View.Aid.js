import Random from "../util/Ux.Random";
import U from "underscore";
import E from "../Ux.Error";
import React from "react";
import {Col, Icon, message} from 'antd';
import getSpan from './Ux.Jsx.View.Layout';
import Type from '../Ux.Type';
import Value from '../Ux.Value';
import Util from '../util';
import Ajax from '../ajax/Ux.Ajax';
import Prop from '../prop';
import {saveAs} from "file-saver";

import {LoadingImage} from 'web';

const extractValue = ($data, config) => {
    let field = config.field;
    if (config['fullpath']) {
        field = config['fullpath'];
    } else if (config.path) {
        field = config.path + '.' + field;
    }
    return ($data && $data.is()) ? $data._(field) : "";
};
const _extractLabel = config => config.label ? config.label : "";

const _renderLabel = (label, value, config) => {
    const key = Random.randomString(16);
    const _renderValue = (item) => {
        if (U.isArray(item)) {
            if (config.meta && config.meta.vlist) {
                return (item.map(each => (<li key={Random.randomString(8)}>{each}</li>)));
            } else {
                const hr = config.meta.hr;
                return item.map(each => (hr ? (<span key={Random.randomString(8)}>{each}
                    <hr/></span>) : each));
            }
        } else {
            return item;
        }
    };
    if (config.hasOwnProperty('defaultValue')) {
        if (!value) {
            value = config.defaultValue;
        }
    }
    const span = getSpan(config);
    const {style = {}} = config.meta ? config.meta : {};
    style.width = "100%";
    if ("table" === config.mode || "subview" === config.mode) {
        span.valueStyle.paddingLeft = 0;
    }
    return label ? (
        <div key={`${key}`} style={style}>
            <Col span={span.label}
                 className={"page-item-label"}
                 style={span.labelStyle}>{label}：</Col>
            <Col span={span.value}
                 className={"page-item-value"}
                 style={span.valueStyle}>{_renderValue(value)}</Col>
        </div>
    ) : _renderValue(value);
};
const highFun = ($data, config, reference, convertFun = data => data) => {
    E.fxTerminal(!config.meta, 10039, config.meta);
    // 读取值
    const value = extractValue($data, config);
    const label = _extractLabel(config);
    // 挂载原始数据
    config.raw = $data;
    let finalValue = value;
    if (U.isFunction(convertFun)) {
        finalValue = convertFun(value, config, reference);
    }
    return _renderLabel(label, finalValue, {
        ...config,
        _current: value
    });
};
const _extractChild = (dataItem = {}, config, values = []) => {
    const result = {};
    const $keys = Value.immutable(values);
    if (config) {
        // 前缀信息
        if (config.prefix) result.prefix = config.prefix;
        if (config.path && config.field) {
            // 读取数据的path, field
            const children = Value.extract(dataItem, config.path, config.field,
                item => $keys.contains(item.key));
            if (U.isArray(children)) {
                result.children = children;
            } else {
                result.children = [children];
            }
        } else {
            // 读取Options处理
            if (U.isArray(dataItem.children)) {
                result.children = dataItem.children.map(item => {
                    if ("string" === typeof item) {
                        const each = {};
                        const splited = item.split(',');
                        each.key = splited[0];
                        each.display = splited[1];
                        return each;
                    } else return item;
                }).filter(item => $keys.contains(item.key))
                    .map(item => item.display);
            } else {
                // 暂时没有其他输出项
                result.children = [];
            }
        }
    }
    return result;
};
const _extractDatum = (dataItem = {}, config = {}, field = "", values = []) => {
    const result = {};
    result.key = dataItem.key;
    if (0 <= field.indexOf(":")) {
        result.display = Util.formatExpr(field, dataItem);
    } else {
        result.display = dataItem[field];
    }
    // 是否处理children
    const childrenObj = _extractChild(dataItem, config.children, values);
    Object.assign(result, childrenObj);
    return result;
};
const _extractItem = (dataItem = {}, config = {}, values = []) => {
    const result = {};
    result.key = dataItem.key;
    if (dataItem.metadata) {
        const kv = dataItem.metadata.split(",");
        result.key = kv[0];
        result.display = kv[1];
    } else {
        result.key = dataItem.key;
        result.display = dataItem.display ? dataItem.display : "";
    }
    // 是否处理children
    const childrenObj = _extractChild(dataItem, config.children, values);
    Object.assign(result, childrenObj);
    return result;
};
const extractList = (reference, config = {}, value) => {
    // 配置特殊处理，针对提取专用处理
    let results = [];
    const values = value && U.isArray(value) ? value : Object.keys(value);
    if (config.datum) {
        const label = config.datum.label ? config.datum.label : "name";
        // 先过滤
        const dataSource = values.map(key =>
            Type.elementUniqueDatum(reference, config.datum.source, 'key', key));
        dataSource.forEach(dataItem =>
            // 注意子过滤
            results.push(_extractDatum(dataItem, config, label, value[dataItem.key])));
    } else if (config.items) {
        config.items.forEach(dataItem =>
            // 注意子过滤
            results.push(_extractItem(dataItem, config, value[dataItem.key])));
        // 后过滤
        const $values = Value.immutable(values);
        results = results.filter(item => $values.contains(item.key));
    }
    return results;
};
const _catchError = (reference) => (errors = {}) => {
    const info = Prop.fromHoc(reference, "fatal");
    const {data = {}} = errors;
    if (info) {
        const mapping = info.download ? info.download : {};
        const content = mapping[data.status];
        if (content) {
            message.destroy();
            message.error(content);
        }
    }
};
const on2Download = (reference, config = {}, value = {}) => (event) => {
    event.preventDefault();
    // 下载链接
    const link = Util.formatExpr(config.ajax, value);
    return Ajax.ajaxDownload(link, value, {})
        .then(data => saveAs(data, value.name))
        .catch(_catchError(reference));
};
const extractLink = (reference, config = {}, value = {}) => {
    return (
        <li className={"download-link"} key={value.key | value.uid}>
            <a href={"#"} onClick={on2Download(reference, config, value)}>
                <Icon type={"link"}/>&nbsp;&nbsp;
                {value.name}
            </a>
        </li>
    );
};
const extractImage = (reference, config = {}, value = {}) => {
    return (<LoadingImage reference={reference}
                          config={config}
                          style={{
                              width: 160,
                              height: 160,
                              margin: 5,
                          }}
                          params={value}/>);
};
export default {
    highFun,
    extractList,
    extractValue,
    extractLink,
    extractImage,
    extractLabel: _extractLabel,
    getSpan
};