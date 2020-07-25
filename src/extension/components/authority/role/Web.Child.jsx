import Ex from 'ex';
import React from 'react';
import UiExport from './form/Web.Export';
import UiImport from './form/Web.Import';

export default (reference) => () => {
    const {$inited = {}} = reference.state;
    if ("EXPORT" === $inited.type) {
        return (
            <UiExport {...Ex.yoAmbient(reference)}/>
        )
    } else {
        return (
            <UiImport {...Ex.yoAmbient(reference)}/>
        )
    }
}