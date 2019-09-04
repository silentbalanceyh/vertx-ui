import R from '../../engine/expression';
import {MagicView} from "web";
import React from "react";

const aiMagic = (reference, jsx = {}) => {
    const {config = {}, ...rest} = jsx;
    const items = R.Ant.toOptions(reference, config);
    if (items && items.length > 0) {
        config.items = items;
    }
    return (<MagicView {...rest} config={config} reference={reference}/>);
};

export default {
    aiMagic,
}