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
/**
 * ## 扩展函数
 *
 * （高频函数）执行渲染拦截的专用函数：
 *
 * 1. `$ready = true`，执行渲染。
 * 2. `$ready = false`，不执行渲染，只 Loading。
 *
 * @memberOf module:_channel
 * @method yoRender
 * @param {ReactComponent} reference React对应组件引用
 * @param {Function} fnJsx 执行jsx的Render
 * @param {Object} debug 调试信息
 * @returns {Jsx}
 */
export default (reference = {}, fnJsx, debug = {}) => {
    const state = reference.state ? reference.state : {};
    const {error} = state;
    if (error) {
        /*
         * fxError 已经切换 fxFailure
         */
        return Ux.E.fxFailure(error);
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
            return U.isFunction(fnJsx) ? fnJsx() : fnJsx;
        } else {
            _outLoading(name, {props, state});
            return (<LoadingContent $height={$height}/>);
        }
    }
}