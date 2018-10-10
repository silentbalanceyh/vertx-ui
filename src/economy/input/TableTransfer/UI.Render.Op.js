import React from 'react';

const renderOp = (reference, from = false) => (text, record, index) => {
    if (from) {
        return (<span>From</span>)
    } else {
        return (<span>To</span>)
    }
};
const renderTo = (column = {}) => {
    if ("LABEL" !== column['$render']) {
        return (text) => {
            return (<span>{text}</span>)
        };
    } else return column.render;
};
export default {
    renderOp,
    renderTo,
}