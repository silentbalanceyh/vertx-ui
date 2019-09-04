import React from "react";

const aiDatumCascade = (reference, jsx = {}) => {

    return (<span>H</span>);
};
const ai2DatumCascade = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return aiDatumCascade(reference, jsx, fnChange);
};

export default {
    aiDatumCascade,
    ai2DatumCascade,
}