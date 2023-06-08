import {_Ant} from 'zo';
import React from 'react';
import TableTransfer from "./TableTransfer/UI";
import __Yo from './field.__.fn.yo.configuration';

// import aiTableTransfer from './O.tree.select';
const aiTableTransfer = (reference, jsx = {}, onChange) => {
    /*
     * 1）onChange
     * 2）readOnly
     * 3）disabled
     */
    const rest = __Yo.yoNormalize(reference, {
        ...jsx,
        eventDisabled: true,        // 只读时候需要禁用
    }, onChange);
    // 处理TreeSelect
    const {config = {}} = jsx;
    // onChange处理
    const options = _Ant.toOptions(reference, config);
    _Ant.onChange(rest, onChange, {
        ...jsx,
        options
    });
    // 没有任何内容时候的 100% 宽度处理
    if (!rest.style) {
        rest.style = {width: "100%"};
    }
    _Ant.onReadOnly(rest, true, reference);
    if (rest.readOnly) {
        _Ant.onCssClass(rest, "ux_readonly_select");
    }
    const inherit = __Yo.yoPropWith(reference);
    return (<TableTransfer {...rest}
                           {...inherit}
                           config={config}
                           data={options}
                           reference={reference}/>);
};
export default {
    aiTableTransfer,
}