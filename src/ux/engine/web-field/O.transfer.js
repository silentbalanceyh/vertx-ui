import R from "../expression";
import normalizeAttribute from "./I.fn.uniform";
import React from 'react';
import {CheckTransfer} from 'web';
import Ut from '../../unity';

const aiTransfer = (reference, jsx = {}, onChange) => {
    /*
     * filters 计算
     * 1）$filters 就是一个 Object
     * 2）$filters 是一个函数
     */
    const {config = {}, depend} = jsx;
    const options = R.Ant.toOptions(reference, config);
    /*
     * 1）onChange
     * 2）readOnly
     * 3）disabled
     */
    const rest = normalizeAttribute(reference, {
        ...jsx,
        eventDisabled: true,        // 只读时需要禁用
        options,
    }, onChange);
    /*
     * Linker处理，修改 onChange
     */
    R.Ant.onChange(rest, onChange, {
        config, options, reference, depend
    });
    const $rest = Ut.toLimit(rest, ["onChange"]);
    return (
        <CheckTransfer {...$rest} config={config}  // 因为 rest 中去掉了 config, trigger, filter
                       $source={options}
                       reference={reference}/>
    )
};
const ai2Transfer = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return aiTransfer(reference, jsx, fnChange);
};
export default {
    aiTransfer,
    ai2Transfer
}