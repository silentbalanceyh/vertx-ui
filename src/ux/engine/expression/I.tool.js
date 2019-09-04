import E from "../../error";
import U from "underscore";
import {Icon} from "antd";
import React from "react";
import Ut from '../../unity';

const uniform = (item, callback) => {
    E.fxTerminal(!callback || !U.isFunction(callback), 10041, callback);
    if (U.isArray(item)) {
        item.forEach(each => callback(each));
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
    });
};

const applyIcon = (jsx, key = "") => {
    const {type, ...rest} = jsx[key];
    jsx[key] = (
        <Icon type={type} {...rest}/>
    );
};
const applyItem = (each = {}, config = {}, configExpr) => {
    const {key = "key", label = "label"} = config;
    // 将key进行配置转换
    if (each[key]) each['key'] = each[key];
    // 将label进行配置转换
    let expr = null;
    if (configExpr) {
        expr = configExpr;
    } else {
        expr = label;
    }
    // 构造label专用
    each['label'] = Ut.valueExpr(expr, each);
    // 是否追加style，children：已经存在了
    return each;
};
export default {
    applyIcon,
    applyValue,
    applyItem,
};