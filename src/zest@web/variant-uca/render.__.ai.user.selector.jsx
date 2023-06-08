import __Yo from './field.__.fn.yo.configuration';
import React from 'react';
import UserSelector from "./UserSelector/UI";

const aiUserSelector = (reference, jsx = {}) => {
    __Yo.yoCssAdjust(jsx, "selector-list");
    const inherit = __Yo.yoPropWith(reference);
    return (<UserSelector {...inherit} {...jsx} reference={reference}/>)
}
export default {
    aiUserSelector,
}