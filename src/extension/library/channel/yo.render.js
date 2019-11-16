import React from 'react';
import {LoadingContent} from 'web';
import U from 'underscore';
import Ux from 'ux';

const _outReady = (form, message, debug = {}) => {
    const {name, color} = debug;
    if (form) {
        const isTouched = form.isFieldsTouched();
        if (!isTouched) {
            Ux.dgDebug(message, `[ ${name} ] Form Ready `, color);
        }
    } else {
        Ux.dgDebug(message, `[ ${name} ] Ready `, color);
    }
};

const _outLoading = (name, message) => {
    Ux.dgDebug(message, `............ [ ${name} ] `, "#9E9E9E");
};

export default (reference = {}, jsx, debug = {}) => {
    const state = reference.state ? reference.state : {};
    const {error} = state;
    if (error) {
        /*
         * fxError 已经切换 fxFailure
         */
        return Ux.E.jsxError(error);
    } else {
        /*
         * Debug专用
         */
        const props = reference.props;
        const {name} = debug;
        const {$ready = false} = state;

        const {$height, form} = props;
        if ($ready) {
            _outReady(form, {props, state}, debug);
            return U.isFunction(jsx) ? jsx() : jsx;
        } else {
            _outLoading(name, {props, state});
            return (<LoadingContent $height={$height}/>);
        }
    }
}