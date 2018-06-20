import React from 'react'
import {Icon} from 'antd';
import U from "underscore";
import Prop from "../Ux.Prop";
import Random from "../Ux.Random";

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

class RxAnt {
    static toParsed(expr = "") {
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
    }

    static onPrefix(jsx = {}) {
        if ("object" === typeof jsx.prefix) {
            const {type, ...rest} = jsx.prefix;
            jsx.prefix = (
                <Icon type={type} {...rest}/>
            )
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

    static toOptions(reference, $config = {}) {
        let options = [];
        if ($config.items) {
            // 如果存在items的根节点，则直接items处理
            options = $config.items;
        } else if ($config.datum) {
            // 如果存在datum节点，则从Assist/Tabular数据源中读取
            const {source, key = "key", label = "label"} = $config.datum;
            if (source && "string" === typeof source) {
                const data = Prop.onDatum(reference, source);
                if (U.isArray(data)) {
                    data.forEach(each => {
                        const option = {};
                        if (each[key]) {
                            option['value'] = each[key];
                            option['key'] = each[key];
                        }
                        if (each[label]) {
                            option['label'] = each[label];
                        }
                        options.push(option);
                    })
                } else {
                    console.error(`[RxAnt] The 'source=${source}' data must be Array.`);
                }
            } else {
                console.error("[RxAnt] The 'source' key of configuration is invalid.");
            }
        }
        applyValue(options);
        return options;
    }
}

export default RxAnt;