import {DialogEditor} from 'web';
import React from 'react';

const aiDialogEditor = (reference, jsx = {}) => {
    /*
     * 表格中的行执行器
     */
    const {$rows = {}} = reference.props;
    return (<DialogEditor {...jsx} reference={reference} $rows={$rows}/>)
};

export default {
    aiDialogEditor
}