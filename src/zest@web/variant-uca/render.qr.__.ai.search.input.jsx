import React from 'react';
import SearchInput from './SearchInput/UI';

const aiSearchInput = (reference, jsx = {}) => {
    return (<SearchInput {...jsx} reference={reference}/>)
};

export default {
    aiSearchInput,
}