import React from 'react';
import {LoadingContent} from 'web';
import U from 'underscore';
import Ux from 'ux';

const yxRender = (reference = {}, jsx) => {
    const state = reference.state ? reference.state : {};
    const {error} = state;
    if (error) {
        return Ux.fxError(error);
    } else {
        const {$ready = false} = state;
        const {$height} = reference.props;
        if ($ready) {
            return U.isFunction(jsx) ? jsx() : jsx;
        } else {
            return (<LoadingContent $height={$height}/>);
        }
    }
};
export default {
    yxRender
};