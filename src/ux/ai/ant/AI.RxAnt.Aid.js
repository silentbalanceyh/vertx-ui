import E from "../../Ux.Error";
import U from "underscore";
import {Icon} from "antd";
import React from "react";

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
export default {
    uniform,
    applyIcon,
    applyValue
};