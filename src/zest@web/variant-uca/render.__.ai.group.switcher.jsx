import __Yo from './field.__.fn.yo.configuration';
import React from 'react';
import GroupSwitcher from "./GroupSwitcher/UI";
import {_Ant} from 'zo';

const aiGroupSwitcher = (reference, jsx = {}) => {
    __Yo.yoCssAdjust(jsx, "selector-list");
    const inherit = __Yo.yoPropWith(reference);
    inherit.options = _Ant.toOptions(reference, jsx.config);
    // ReadOnly = true / false
    _Ant.onReadOnly(jsx, true, reference);
    if (jsx.readOnly) {
        _Ant.onCssClass(jsx, "ux_readonly_select");
    }
    return (<GroupSwitcher {...jsx} {...inherit} reference={reference}/>)
}
export default {
    aiGroupSwitcher,
}