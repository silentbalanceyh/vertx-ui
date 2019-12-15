import rx from './O.rx';
import ajax from './O.ajax';
import async from './O.async';
import prepare from './O.ajax.prepare';
/*
 * 响应类的 ajax 请求
 */
import ajaxCallback from './O.ajax.callback';

export default {
    ...prepare,
    ...rx,
    ...ajax,
    ...async,
    ...ajaxCallback,
}