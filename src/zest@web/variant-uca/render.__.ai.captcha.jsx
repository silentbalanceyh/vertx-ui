import __Yo from './field.__.fn.yo.configuration';
import React from 'react';
import InputCaptcha from "./InputCaptcha/UI";

const aiCaptcha = (reference, jsx = {}, onChange) => {
    jsx = __Yo.yoInput(reference, jsx, onChange);
    return (<InputCaptcha {...jsx} reference={reference}/>)
}
export default {
    aiCaptcha,
}