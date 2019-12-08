import {JsonEditor} from 'web';
import React from 'react';

const aiJsonEditor = (reference, jsx = {}) => {
    return (<JsonEditor {...jsx} reference={reference}/>)
};

export default {
    aiJsonEditor
}