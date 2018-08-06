import React from 'react'
import {Icon} from 'antd';
import U from "underscore";
import Prop from "../Ux.Prop";
import Expr from './AI.Expr.String';
import Random from "../Ux.Random";
import Attributes from '../Ux.Attribute';
import Uarr from '../structure/Ux.Uarr'

const uniform = (item, callback) => {
    if (!callback || !U.isFunction(callback)) {
        console.error("[RxAnt] Input parameter 'callback' must be function.")
    }
    if (U.isArray(item)) {
        item.forEach(each => callback(each))
    } else if ("object" === typeof item) {
        callback(item);
    } else {
        console.error("[RxAnt] Input parameter 'item' must be Object/Array.")
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

const parseExpr = (expr = "") => {
    const item = expr.replace(/ /g, '');
    const kv = item.split(',');
    const attr = {};
    kv.forEach(keyValue => {
        const key = keyValue.split('=')[0];
        attr[key] = keyValue.split('=')[1];
    });
    if (!attr.hasOwnProperty('key')) {
        attr.key = Random.randomString(12);
    }
    return attr;
};

const parseDatum = (config = {}) => {
    let meta = config.datum;
    if ("string" === typeof config.datum) {
        meta = parseExpr(config.datum);
    }
    return meta;
};

const extractDatum = (reference, config = {}, filter = () => true) => {
    let options = [];
    // 如果存在datum节点，则从Assist/Tabular数据源中读取
    const {source} = parseDatum(config);
    if (source && "string" === typeof source) {
        const data = Prop.onDatum(reference, source);
        if (U.isArray(data)) {
            options = data.filter(filter)
        } else {
            console.error(`[RxAnt] The 'source=${source}' data must be Array.`);
        }
    } else {
        console.error("[RxAnt] The 'source' key of configuration is invalid.");
    }
    return options;
};

class RxAnt {
    static toParsed(expr = "") {
        return parseExpr(expr);
    }

    static toDatum(config = {}) {
        return parseDatum(config)
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
        if ("object" === typeof jsx.prefix) {
            applyIcon(jsx, 'prefix');
        }
    }

    static onAddonAfter(jsx = {}) {
        if ("object" === typeof jsx.addonAfter) {
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
        if ("object" === typeof config) {
            return config;
        } else if ("string" === typeof config) {
            return {content: config};
        } else {
            console.error("[RxAnt] Extract config 'config' type is invalid.");
            return {content: "RxAnt Error occurs!"}
        }
    }

    static toTreeOptions(reference, config = {}) {
        let options = [];
        if (config.items) {
            options = config.items;
        } else if (config.datum) {
            options = extractDatum(reference, config);
        }
        return Uarr.create(options)
            .sort((left, right) => left.left - right.left)
            .convert("code", (code, item) => item["code"] + " - " + item["name"])
            .mapping({
                id: "id",
                pid: "pid",
                label: "code",
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
            const data = extractDatum(reference, config, filter);
            const {key = "key", label = "label"} = parseDatum(config);
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