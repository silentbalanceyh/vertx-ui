import {TreeSelect} from "antd";
import React from "react";
import R from '../expression';
import normalizeAttribute from './I.fn.uniform';

/*
 // 处理onChange，解决rest为 {}时引起的参数Bug
    const rest = Aid.fixAttrs(jsx);
    R.Ant.onChange(rest, onChange, {
        reference, // 增强时需要使用，组件引用
        config, // 当前Jsx中的配置
    });
 */

const aiTreeSelect = (reference, jsx = {}, onChange) => {
    /*
     * 1）onChange
     * 2）readOnly
     * 3）disabled
     */
    const rest = normalizeAttribute(reference, {
        ...jsx,
        eventDisabled: true,        // 只读时候需要禁用
    }, onChange);
    // 处理TreeSelect
    const {config = {}} = jsx;
    const data = R.Ant.toTreeOptions(reference, config);
    // 没有任何内容时候的 100% 宽度处理
    if (!rest.style) {
        rest.style = {width: "100%"};
    }
    return (<TreeSelect treeData={data} {...rest}/>);
};

const ai2TreeSelect = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return aiTreeSelect(reference, jsx, fnChange);
};
export default {
    aiTreeSelect,
    ai2TreeSelect,
}