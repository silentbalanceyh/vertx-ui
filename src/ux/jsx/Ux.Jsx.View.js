import React from 'react';
import Type from '../Ux.Type';
import Random from '../util/Ux.Random';
import U from 'underscore';
import {DataLabor} from 'entity';
import Expr from '../util/Ux.Expr';
import Value from '../Ux.Value';
import {Table} from 'antd';
import Column from '../Ux.Column';
import fieldRender from './Ux.Jsx.Single';
import Hsx from './Ux.Jsx.View.Fn';
import Aid from './Ux.Jsx.View.Aid';
import moment from 'moment';

const config = ($data, config, reference) => Aid.highFun($data, config, reference, (value, config) => {
    const dataMap = config.meta;
    const literal = dataMap ? dataMap[value] : value;
    const item = Value.valueIcon(literal);
    return fieldRender.jsxIcon(item);
});
const subview = ($data, config, reference) => Aid.highFun($data, config, reference, (value, config) => {
    const meta = config.meta;
    const page = config.extension;
    const renderField = (item) => Hsx.viewGrid(page, reference, DataLabor.getObject(item), {}, meta['key'], true);
    let hitData = value;
    if (!U.isArray(value) && U.isObject(value)) {
        hitData = Value.clone(value);
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
const datum = ($data, config, reference) => Aid.highFun($data, config, reference, (value, config) => {
    const meta = config.meta;
    let uniqueObj = Type.elementUniqueDatum(reference, meta.key, 'key', value);
    if (!uniqueObj) return false;
    return meta.expr ? Expr.formatExpr(meta.expr, uniqueObj) : uniqueObj[meta.field];
});
const checktext = ($data, config, reference) => Aid.highFun($data, config, reference, (value = {}, config) => {
    const source = Aid.extractList(reference, config.meta, value.checked);
    const out = source.map(item => item.display);
    if (value.other) {
        out.push(value.other);
    }
    return (
        <span>
            {out.join(', ')}
        </span>
    );
});
const multi = ($data, config, reference) => Aid.highFun($data, config, reference, (value = {}, config) => {

    return (
        <span></span>
    );
});
const list = ($data, config, reference) => Aid.highFun($data, config, reference, (value, config) => {
    // Source的轻量级转换
    const lists = Aid.extractList(reference, config.meta, value);
    const renderChild = (item = {}) => {
        const {prefix, children = []} = item;
        return (
            <span>
                {0 < children.length ? <br/> : false}
                {0 < children.length && prefix ? `${prefix}：` : false}
                {children.join(', ')}
            </span>
        );
    };
    return (
        <ul className={"page-view-ul"}>
            {lists.map(each => {
                return (
                    <li key={each.key}>
                        {each.display}
                        {renderChild(each)}
                    </li>
                );
            })}
        </ul>
    );
});
const array = ($data, config, reference) => Aid.highFun($data, config, reference, (value, config) => {
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
const date = ($data, config, reference) => Aid.highFun($data, config, reference, (value, config) => {
    const meta = config.meta;
    const format = meta.format;
    if (value) {
        let literal = "";
        if (meta.field) {
            literal = value[meta.field];
        } else {
            literal = value;
        }
        if (literal) {
            const target = Value.convertTime(literal);
            return moment.isMoment(target) ? target.format(format) : false;
        } else {
            return false;
        }
    } else {
        return false;
    }
});
const duration = ($data, config, reference) => Aid.highFun($data, config, reference, (value, config) => {
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
const positive = ($data, config, reference) => Aid.highFun($data, config, reference, (value, config) => {
    const expr = config.meta.expr;
    let result = 0 < value ? value : 0;
    if (expr) {
        result = Expr.formatExpr(expr, {value: result});
    }
    return result;
});
const file = ($data, config, reference) => Aid.highFun($data, config, reference, (value, config) => {
    const target = value && value[0] ? value[0] : {};
    return Aid.extractLink(reference, config, target);
});
const files = ($data, config, reference) => Aid.highFun($data, config, reference, (value = [], config) =>
    value.map(each => Aid.extractLink(reference, config, each)));
const picture = ($data, config, reference) => Aid.highFun($data, config, reference, (value, config) => {
    const target = value && value[0] ? value[0] : {};
    return Aid.extractImage(reference, config, target);
});
const table = ($data, config, reference) => Aid.highFun($data, config, reference, (value, config) => {
    value = Aid.extractValue($data, config);
    if (U.isArray(value)) {
        value.forEach(each => {
            each.key = Random.randomString(12);
            each.style = {height: 20};
        });
        Column.uiTableColumn(reference, config.meta.columns);
        const attrs = {};
        attrs.bordered = false;
        attrs.pagination = false;
        attrs.className = "page-view-table page-item-value-table";
        return (
            <Table {...config.meta} dataSource={value}
                   {...attrs}/>
        );
    } else {
        // 关闭表格中的错误渲染
        // E.fxTerminal(true, 10040, value);
        return false;
    }
});
export default {
    config,
    // 普通调用
    pure: Aid.highFun,
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
    list,
    checktext,
    multi,
    extractValue: Aid.extractValue,
};