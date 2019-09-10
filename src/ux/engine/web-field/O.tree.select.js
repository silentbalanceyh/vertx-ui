import Aid from "./I.fix";
import {TreeSelect} from "antd";
import React from "react";
import R from '../expression';

const aiTreeSelect = (reference, jsx = {}, onChange) => {
    const {config = {}} = jsx;
    // 处理TreeSelect
    const data = R.Ant.toTreeOptions(reference, config);
    // 处理onChange，解决rest为 {}时引起的参数Bug
    const rest = Aid.fixAttrs(jsx);
    R.Ant.onChange(rest, onChange, {
        reference, // 增强时需要使用，组件引用
        config, // 当前Jsx中的配置
    });
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