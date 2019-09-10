import Ux from 'ux';
import Fn from "../generator";

const add = (reference) => (params = {}, config = {}) => {
    let request = Ux.valueRequest(params);
    request = Ux.valueValid(request);
    return Ux.ajaxPost(config.uri, request)
        .then(Ux.ajax2Message(reference, config.dialog))
        .then(response => {
            Fn.rx(reference).close(response);
            return Ux.promise(response);
        })
};

const save = (reference) => (params = {}, config = {}) => {
    let request = Ux.valueRequest(params);
    request = Ux.valueValid(request);
    return Ux.ajaxPut(config.uri, request)
        .then(Ux.ajax2Message(reference, config.dialog))
        .then(response => {
            Fn.rx(reference).close(response);
            return Ux.promise(response);
        })
};
export default (reference) => ({
    add: add(reference),
    save: save(reference)
})