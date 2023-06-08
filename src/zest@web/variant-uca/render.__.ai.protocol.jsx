import __Yo from './field.__.fn.yo.configuration';
import React from 'react';
import InputProtocol from "./InputProtocol/UI";

const aiProtocol = (reference, jsx = {}, onChange) => {
    jsx = __Yo.yoInput(reference, jsx, onChange);
    return (<InputProtocol {...jsx} reference={reference}/>)
}
export default {
    aiProtocol,
}