import Fn from '../functions';
import React from 'react';
import {LoadingContent} from 'web';
import U from 'underscore';
import Ux from 'ux';

export default (reference = {}, jsx) => {
    const state = Fn.state(reference);
    const {error} = state;
    if (error) {
        return Ux.fxError(error);
    } else {
        const {$ready = false} = state;
        const {$height} = Fn.props(reference);
        if ($ready) {
            return U.isFunction(jsx) ? jsx() : jsx;
        } else {
            return (<LoadingContent $height={$height}/>);
        }
    }
}