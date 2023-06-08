import __Yo from './field.__.fn.yo.configuration';
import React from 'react';
import UserGroup from "./UserGroup/UI";

const aiUserGroup = (reference, jsx = {}) => {
    __Yo.yoCssAdjust(jsx, "selector-list");
    const inherit = __Yo.yoPropWith(reference);
    return (<UserGroup {...inherit} {...jsx} reference={reference}/>)
}
export default {
    aiUserGroup,
}