import React from 'react'
import {Icon} from 'antd';
import U from "underscore";
import Prop from "../../prop/Ux.Prop";
import Util from '../../util/index';
import Expr from '../expr/AI.Expr.String';
import Datum from './AI.RxAnt.Datum';
import Attributes from '../../prop/Ux.Attribute';
import Uarr from '../../structure/Ux.Uarr'
import E from '../../Ux.Error';

const uniform = (item, callback) => {
    E.fxTerminal(!callback || !U.isFunction(callback), 10041, callback);
    if (U.isArray(item)) {
        item.forEach(each => callback(each))
    } else if (U.isObject(item)) {
        callback(item);
    } else {
        E.fxTerminal(true, 10042, item);
    }
};

const applyValue = (option) => {
    uniform(option, (item) => {
        if (item.key && !item.value) {
            item.value = item.key;
        }
    })
};

const applyIcon = (jsx, key = "") => {
    const {type, ...rest} = jsx[key];
    jsx[key] = (
        <Icon type={type} {...rest}/>
    )
};

class RxAnt {
    static toParsed(expr = "") {
        return Datum.parseExpr(expr);
    }

    static toDatum(config = {}) {
        return Datum.parseDatum(config)
    }

    static onDisabledDate(jsx = {}) {
        if (jsx.hasOwnProperty('disabledDate')) {
            const attrFun = Attributes[jsx.disabledDate];
            if (U.isFunction(attrFun)) {
                jsx.disabledDate = attrFun;
            }
        }
    }

    static onPrefix(jsx = {}) {
        if (U.isObject(jsx.prefix)) {
            applyIcon(jsx, 'prefix');
        }
    }

    static onPlaceHolder(jsx = {}) {
        if (jsx.readOnly) {
            delete jsx.placeholder;
        }
    }

    static onMockData(jsx = {}, reference) {
        const {config = {}} = jsx;
        if (config.mock) {
            const {mock = {}} = reference.state;
            jsx.mock = mock;
        }
    }

    static onAddonAfter(jsx = {}) {
        if (U.isObject(jsx.addonAfter)) {
            applyIcon(jsx, 'addonAfter');
        }
    }

    static onChange(jsx = {}, onChange) {
        if (U.isFunction(onChange)) {
            jsx.onChange = onChange;
        }
    }

    static toDialogConfig(reference, ...path) {
        const config = Prop.fromPath.apply(null, [reference].concat(path));
        if (U.isObject(config)) {
            return config;
        } else if ("string" === typeof config) {
            return {content: config};
        } else {
            return {content: E.fxTerminal(true, 10045, config)};
        }
    }

    static toTreeOptions(reference, config = {}) {
        let options = [];
        if (config.items) {
            options = config.items;
        } else if (config.datum) {
            options = Datum.gainDatum(reference, config);
        }
        const processor = (code, item) => {
            if (config.expr) {
                return Util.formatExpr(config.expr, item);
            } else {
                return item.label;
            }
        };
        return Uarr.create(options)
            .sort((left, right) => left.left - right.left)
            .convert("code", processor)
            .mapping({
                id: "id",
                pid: "pid",
                title: "code",
                value: "id"
            })
            .tree("id", "pid")
            .to();
    }

    static toOptions(reference, config = {}, filter = () => true) {
        let options = [];
        if (config.items) {
            // 如果存在items的根节点，则直接items处理
            options = Expr.aiExprOption(config.items);
        } else if (config.datum) {
            // 如果存在datum节点，则从Assist/Tabular数据源中读取
            const data = Datum.gainDatum(reference, config, filter);
            const {key = "key", label = "label"} = Datum.parseDatum(config);
            data.forEach(each => {
                const option = {};
                if (each[key]) {
                    option['value'] = each[key];
                    option['key'] = each[key];
                }
                if (each[label]) {
                    option['label'] = each[label];
                }
                if (each.hasOwnProperty('style')) {
                    option['style'] = each.style;
                }
                options.push(option);
            });
        }
        applyValue(options);
        return options;
    }
}

export default RxAnt;