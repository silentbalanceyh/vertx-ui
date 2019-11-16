import React from 'react';
import Ux from 'ux';
import Event from './event';

export default (reference, config = {}) => (item = {}) => {
    const text = Ux.formatExpr(config.label, item, true);
    return (
        <p className={"row-item"}>
            <a onClick={Event.onRemove(reference, item)}>
                {config.op}
            </a>
            &nbsp;&nbsp;&nbsp;&nbsp;
            {text}
        </p>
    );
}