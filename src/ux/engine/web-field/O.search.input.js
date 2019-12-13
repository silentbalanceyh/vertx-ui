import {SearchInput} from 'web';
import React from 'react';

const aiSearchInput = (reference, jsx = {}) => {
    return (<SearchInput {...jsx} reference={reference}/>)
};
export default {
    aiSearchInput
}