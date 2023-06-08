import {_Ant} from 'zo';
import __Yo from './field.__.fn.yo.configuration';
import __Zn from './zero.uca.func.dependency';
import React from 'react';
import CheckJson from "./CheckJson/UI";

// import CheckJson from './O.check.json';
const aiCheckJson = (reference, jsx = {}, onChange) => {
    /*
     * 1）onChange
     * 2）readOnly
     * 3）disabled
     */
    const rest = __Yo.yoNormalize(reference, {
        ...jsx,
        eventPrevent: false,        // 不关闭默认行为
        eventDisabled: true,        // 只读时候需要禁用
    }, onChange);
    /*
     * 多选
     */
    const {config} = jsx;
    const options = _Ant.toOptions(reference, config);
    /*
     * 特殊初始值，暂时不取消这里的处理
     */
    const initial = jsx['data-initial'];
    if (initial) {
        if (__Zn.isArray(initial)) {
            rest.defaultValue = initial;
        }
    }
    return (<CheckJson {...rest} reference={reference} $source={options}/>)
}
export default {
    aiCheckJson,
}