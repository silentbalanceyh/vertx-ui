import React from 'react';
import AddressSelector from "./AddressSelector/UI";

const aiAddressSelector = (reference, jsx = {}, onChange) =>
    (<AddressSelector {...jsx} reference={reference} rxSelect={onChange}/>);
export default {
    aiAddressSelector,
}
