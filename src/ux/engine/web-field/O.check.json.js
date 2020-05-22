import {CheckJson} from 'web';
import React from 'react';
import R from "../expression";
import U from "underscore";
import normalizeAttribute from "./I.fn.uniform";

const aiCheckJson = (reference, jsx = {}, onChange) => {
    /*
     * 1）onChange
     * 2）readOnly
     * 3）disabled
     */
    const rest = normalizeAttribute(reference, {
        ...jsx,
        eventPrevent: false,        // 不关闭默认行为
        eventDisabled: true,        // 只读时候需要禁用
    }, onChange);
    /*
     * 多选
     */
    const {config} = jsx;
    const options = R.Ant.toOptions(reference, config);
    /*
     * 特殊初始值，暂时不取消这里的处理
     */
    const initial = jsx['data-initial'];
    if (initial) {
        if (U.isArray(initial)) {
            rest.defaultValue = initial;
        }
    }
    return (<CheckJson {...rest} reference={reference} $source={options}/>)
}
export default {
    aiCheckJson,
}