import {DialogEditor} from 'web';
import React from 'react';

const aiDialogEditor = (reference, jsx = {}) => {
    return (<DialogEditor {...jsx} reference={reference}/>)
};

export default {
    aiDialogEditor
}