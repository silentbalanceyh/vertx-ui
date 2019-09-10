import toAsync from './P.async';
import Ux from 'ux';
import E from '../debug/error';

const parseRequest = (config = {}, reference) => {
    const magic = Ux.clone(config.magic);
    const parsed = Ux.parseInput(magic, reference);
    /*
     * 构造 Ajax
     */
    const {method = "GET", uri} = config;
    if (uri) {
        if ("GET" === method) {
            return Ux.ajaxGet(uri, parsed);
        } else {
            return Ux.ajaxPost(uri, parsed);
        }
    } else {
        return E.error009();
    }
};

export default (reference) => ({
    parseRequest: (config = {}, async = true) => toAsync(parseRequest(config, reference), async),
})