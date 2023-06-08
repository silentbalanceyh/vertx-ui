import __Yo from './field.__.fn.yo.configuration';
import React from 'react';
import UserLeader from "./UserLeader/UI";

const aiUserLeader = (reference, jsx = {}) => {
    __Yo.yoCssAdjust(jsx, "selector-list");
    const inherit = __Yo.yoPropWith(reference);
    return (<UserLeader {...inherit} {...jsx} reference={reference}/>)
}

export default {
    aiUserLeader,
}