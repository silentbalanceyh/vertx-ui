import {AddressSelector} from "web";
import React from "react";

const aiAddressSelector = (reference, jsx = {}) => {
    return (<AddressSelector {...jsx} reference={reference}/>);
};
const ai2AddressSelector = (onSelect, mockData = {}) => (reference, jsx = {}) => {
    const fnChange = onSelect.apply(null, [reference]);
    return (<AddressSelector {...jsx} reference={reference} mock={mockData}
                             rxSelect={fnChange}/>);
};
export default {
    aiAddressSelector,
    ai2AddressSelector
}
