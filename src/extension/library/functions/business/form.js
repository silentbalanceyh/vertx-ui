import Ux from 'ux';
import Fn from '../generator';
import Bs from '../business';
import Q from "../../query";
import G from '../global';

const add = (reference) => (params = {}, config = {}) => {
    /*
     * 前端读取 key
     */
    const {$addKey} = reference.props;
    params.key = $addKey;
    params = Ux.valueValid(params);
    return Ux.ajaxPost(config.uri, params)
        .then(Bs.cbDialog(reference, config.dialog))
        .then(response => Fn.rx(reference).close(response))
};
const save = (reference) => (params = {}, config = {}) => {
    params = Ux.valueValid(params);
    return Ux.ajaxPut(config.uri, params)
        .then(Bs.cbDialog(reference, config.dialog))
        .then(response => Fn.rx(reference).close(response))
};
const remove = (reference) => (params = {}, config = {}) => {
    const input = {key: params.key};
    return Ux.ajaxDelete(config.uri, input)
        .then(Bs.cbDialog(reference, config.dialog))
        .then(Bs.cbTrue(() => Fn.rx(reference).close(params)));
};
const filter = (reference) => (params = {}) => {
    const {connector = "AND", ...rest} = params;
    const values = Q.qdForm(rest, connector);
    Fn.rx(reference).filter(values);    // 维持数据专用
    return G.promise(values)
        .then(response => Fn.rx(reference).close(response));
};
export default (reference) => ({
    add: add(reference),
    save: save(reference),
    remove: remove(reference),
    filter: filter(reference)
})