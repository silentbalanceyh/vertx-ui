import React from 'react';
import E from './Ux.Error'

const fxRender = (reference = {}, key = "") => {
    let message = "";
    if ("string" === typeof key) {
        const {$hoc} = reference.state;
        const name = $hoc.name();
        if (!key.startsWith("_")) key = `_${key}`;
        message = E.fxTerminal(true, 10001, name, key);
    }
    return <div className={"error-page"}>
        {message}
    </div>
};
export default {
    fxRender
}