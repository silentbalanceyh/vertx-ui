import rx from './O.rx';
import ajax from './O.ajax';
import async from './O.async';
/*
 * 响应类的 ajax 请求
 */
import ajaxCallback from './O.ajax.callback';

export default {
    ...rx,
    ...ajax,
    ...async,
    ...ajaxCallback,
}