import {_Ant} from 'zo';
import __Yo from './field.__.fn.yo.configuration';
import React from 'react';
import CheckTransfer from "./CheckTransfer/UI";


// import Transfer from './O.transfer';
const aiTransfer = (reference, jsx = {}, onChange) => {
    /*
     * filters 计算
     * 1）$filters 就是一个 Object
     * 2）$filters 是一个函数
     */
    const {config = {}, depend} = jsx;
    const options = _Ant.toOptions(reference, config);
    /*
     * 1）onChange
     * 2）readOnly
     * 3）disabled
     */
    const rest = __Yo.yoNormalize(reference, {
        ...jsx,
        eventDisabled: true,        // 只读时需要禁用
        options,
    }, onChange);
    /*
     * Linker处理，修改 onChange
     */
    _Ant.onChange(rest, onChange, {
        config, options, reference, depend
    });
    // 打开限制继承
    return (
        <CheckTransfer {...rest} config={config}  // 因为 rest 中去掉了 config, trigger, filter
                       $source={options}
                       reference={reference}/>
    )
};
export default {
    aiTransfer,
}