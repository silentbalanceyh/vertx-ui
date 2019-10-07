import Ux from 'ux';
import Fn from '../generator';

const add = (reference) => (params = {}, config = {}) => {
    let request = Ux.valueRequest(params);
    const {$addKey} = reference.props;
    request.key = $addKey;
    request = Ux.valueValid(request);
    return Ux.ajaxPost(config.uri, request)
        .then(Ux.ajax2Dialog(reference, config.dialog))
        .then(response => Fn.rx(reference).close(response))
};
const save = (reference) => (params = {}, config = {}) => {
    let request = Ux.valueRequest(params);
    request = Ux.valueValid(request);
    return Ux.ajaxPut(config.uri, request)
        .then(Ux.ajax2Dialog(reference, config.dialog))
        .then(response => Fn.rx(reference).close(response))
};
const remove = (reference) => (params = {}, config = {}) => {
    const input = {key: params.key};
    return Ux.ajaxDelete(config.uri, input)
        .then(Ux.ajax2Dialog(reference, config.dialog))
        .then(Ux.ajax2True(
            () => Fn.rx(reference).close(params, {
                $selected: []
            })
        ));
};
const filter = (reference) => (params = {}) => {
    const {connector = "AND", ...rest} = params;
    console.info(params);
    const values = Ux.qrForm(rest, connector);
    Fn.rx(reference).filter(values);    // 维持数据专用
    return Ux.promise(values)
        .then(response => Fn.rx(reference).close(response));
};
export default (reference) => ({
    add: add(reference),
    save: save(reference),
    remove: remove(reference),
    filter: filter(reference)
})