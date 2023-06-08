import React from 'react';
import SearchRangeDate from './SearchRangeDate/UI';

const aiSearchRangeDate = (reference, jsx = {}) => {
    return (<SearchRangeDate {...jsx} reference={reference}/>)
};

export default {
    aiSearchRangeDate,
}