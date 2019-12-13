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
    const values = Ux.qrForm(rest, connector, reference);
    /*
     * 注意双参数
     */
    Fn.rx(reference).filter(values, params);    // 维持数据专用
    return Ux.promise(values)
        .then(response => Fn.rx(reference).close(response));
};
const query = (reference) => (params = {}, filters = {}) => {
    params = Ux.valueValid(params);
    const {connector = "AND", ...rest} = params;
    const values = Ux.qrForm(rest, connector, reference);
    const query = {};
    query.form = Ux.clone(params);
    if (Ux.isEmpty(filters)) {
        query.condition = values;
    } else {
        const request = {};
        request["$filters"] = filters;
        request[""] = true;
        request["$condition"] = values;
        query.condition = request;
    }
    query.request = Ux.clone(values);
    return Ux.promise(query);
};
export default (reference) => ({
    add: add(reference),
    save: save(reference),
    remove: remove(reference),
    filter: filter(reference),
    query: query(reference)
})