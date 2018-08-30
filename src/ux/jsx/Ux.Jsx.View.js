import React from 'react'
import Type from '../Ux.Type'
import Hsx from '../Ux.Jsx';
import Random from '../util/Ux.Random'
import U from 'underscore';
import {DataLabor} from 'entity';
import Immutable from 'immutable';
import Expr from '../util/Ux.Expr'
import Value from '../Ux.Value';
import {Table} from 'antd';
import Column from '../Ux.Column';
import E from '../Ux.Error';
import fieldRender from './Ux.Jsx.Single'

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
                return (item.map(each => (<li key={Random.randomString(8)}>{each}</li>)))
            } else {
                const hr = config.meta.hr;
                return item.map(each => (hr ? (<span key={Random.randomString(8)}>{each}
                    <hr/></span>) : each))
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
    return label ? (
        <span key={`${key}`}>
            <span>{label}：</span>
            <span>{_renderValue(value)}</span>
        </span>
    ) : _renderValue(value);
};
const _highFun = ($data, config, reference, convertFun = data => data) => {
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
    return _renderLabel(label, finalValue, config);
};
const config = ($data, config, reference) => _highFun($data, config, reference, (value, config) => {
    const dataMap = config.meta;
    const literal = dataMap ? dataMap[value] : value;
    const item = Value.valueIcon(literal);
    return fieldRender.jsxIcon(item);
});
const subview = ($data, config, reference) => _highFun($data, config, reference, (value, config) => {
    const meta = config.meta;
    const page = config.extension;
    const renderField = (item) => Hsx.viewGrid(page, reference, DataLabor.getObject(item), {}, meta['key'], true);
    let hitData = value;
    if (!U.isArray(value) && U.isObject(value)) {
        hitData = Immutable.fromJS(value ? value : {}).toJS();
        const converted = [];
        Object.keys(value).forEach(item => {
            const ref = hitData[item];
            ref.key = item;
            converted.push(ref);
        });
        hitData = converted;
    }
    return U.isArray(hitData) ? hitData.map(renderField) :
        renderField(hitData);
});
const datum = ($data, config, reference) => _highFun($data, config, reference, (value, config) => {
    const meta = config.meta;
    let uniqueObj = Type.elementUniqueDatum(reference, meta.key, 'key', value);
    if (!uniqueObj) return false;
    return meta.expr ? Expr.formatExpr(meta.expr, uniqueObj) : uniqueObj[meta.field];
});
const array = ($data, config, reference) => _highFun($data, config, reference, (value, config) => {
    if (U.isArray(value)) {
        const meta = config.meta;
        const fieldPath = meta['fieldPath'];
        if (fieldPath) {
            return value.map(item => DataLabor.getObject(item)._(fieldPath));
        } else {
            return value;
        }
    } else {
        return false;
    }
});
const date = ($data, config, reference) => _highFun($data, config, reference, (value, config) => {
    const meta = config.meta;
    const format = meta.format;
    if (value) {
        value = Value.convertTime(value);
        return value.format(format);
    } else {
        return false;
    }
});
const duration = ($data, config, reference) => _highFun($data, config, reference, (value, config) => {
    const meta = config.meta;
    const format = meta.format;
    if (U.isArray(value)) {
        const from = Value.convertTime(value[0]).format(format);
        const to = Value.convertTime(value[1]).format(format);
        return from + " ~ " + to;
    } else {
        return false;
    }
});
const file = ($data, config, reference) => _highFun($data, config, reference, (value, config) => {

    return false;
});
const positive = ($data, config, reference) => _highFun($data, config, reference, (value, config) => {
    const expr = config.meta.expr;
    let result = 0 < value ? value : 0;
    if (expr) {
        result = Expr.formatExpr(expr, {value: result});
    }
    return result;
});
const files = ($data, config, reference) => _highFun($data, config, reference, (value, config) => {

    return false;
});
const picture = ($data, config, reference) => _highFun($data, config, reference, (value, config) => {

    return false;
});
const table = ($data, config, reference) => {
    const value = extractValue($data, config);
    const label = _extractLabel(config);
    if (U.isArray(value)) {
        value.forEach(each => {
            each.key = Random.randomString(12);
            each.style = {height: 20};
        });
        Column.uiTableColumn(reference, config.meta.columns);
        const attrs = {};
        attrs.bordered = false;
        attrs.pagination = false;
        attrs.className = "page-view-table";
        return label ? (
            <span>
            <span>{label}：</span>
            <span><Table {...config.meta} dataSource={value}
                         {...attrs}/></span>
        </span>
        ) : (
            <Table {...config.meta} dataSource={value}
                   {...attrs}/>
        );
    } else {
        E.fxTerminal(true, 10040, value);
        return false;
    }
};
export default {
    config,
    // 普通调用
    pure: _highFun,
    subview,
    datum,
    date,
    array,
    duration,
    positive,
    // 文件
    file,
    files,
    picture,
    table,
    extractValue,
}