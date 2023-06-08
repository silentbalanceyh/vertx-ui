import __Yo from './field.__.fn.yo.configuration';
import React from 'react';
import {_Ant} from 'zo';

import TableEditor from './TableEditor/UI';
// import TableEditor from './O.editor.table';
const aiTableEditor = (reference, jsx = {}, onChange) => {
    // onChange处理
    _Ant.onChange(jsx, onChange);
    const inherit = __Yo.yoPropWith(reference);
    return (<TableEditor {...jsx} {...inherit} reference={reference}/>);
};
export default {
    aiTableEditor,
}