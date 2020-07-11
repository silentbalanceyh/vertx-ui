import Ux from 'ux';
import Fn from '../generator';
import U from 'underscore';

const add = (reference) => (params = {}, config = {}) => {
    let request = Ux.valueRequest(params);
    const {$addKey} = reference.props;
    request.key = $addKey;
    request = Ux.valueValid(request);
    return Ux.ajaxPost(config.uri, request)
        .then(Ux.ajax2Dialog(reference, config.dialog))
        .then(response => Fn.rx(reference, config.off).close(response))
        .catch(error => Ux.ajaxError(reference, error));
};
const save = (reference) => (params = {}, config = {}) => {
    const normalized = {};
    /*
     * 将 undefined 转换成 null
     */
    Object.keys(params).forEach(field => {
        if (undefined === params[field]) {
            normalized[field] = null;
        } else {
            normalized[field] = params[field];
        }
    });
    let request = Ux.valueRequest(normalized);
    request = Ux.valueValid(request);
    return Ux.ajaxPut(config.uri, request)
        .then(Ux.ajax2Dialog(reference, config.dialog))
        .then(response => Fn.rx(reference, config.off).close(response))
        .catch(error => Ux.ajaxError(reference, error));
};
const remove = (reference) => (params = {}, config = {}) => {
    const input = {key: params.key};
    return Ux.ajaxDelete(config.uri, input)
        .then(Ux.ajax2Dialog(reference, config.dialog))
        .then(Ux.ajax2True(
            () => Fn.rx(reference, config.off).close(params, {
                $selected: []
            })
        ))
        .catch(error => Ux.ajaxError(reference, error));
};
const filter = (reference) => (params = {}) => {
    const {connector = "AND", ...rest} = params;
    const values = Ux.qrForm(rest, connector, reference);
    /*
     * 注意双参数
     */
    Fn.rx(reference).filter(values, params);    // 维持数据专用
    return Ux.promise(values)
        .then(response => Fn.rx(reference).close(response))
        .catch(error => Ux.ajaxError(reference, error));
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
const wizard = (reference) => (params, promiseSupplier) => {
    const {rxFailure} = reference.props;
    const filters = Ux.valueValid(params);
    if (0 < Object.keys(filters).length) {
        const request = {};
        /*
         * 默认带 sigma 支持多应用处理
         */
        const condition = {"": true, ...filters};
        if (!condition.sigma) {
            const app = Ux.isInit();
            if (app.sigma) {
                condition.sigma = app.sigma;
            }
        }
        request.criteria = condition;
        if (U.isFunction(promiseSupplier)) {
            const promise = promiseSupplier(request);
            return promise.then(result => {
                if (!result || 0 === result.length) {
                    if (U.isFunction(rxFailure)) {
                        rxFailure(() => reference.setState({
                            $loading: false, $submitting: false
                        }), false);
                    }
                } else {
                    const {rxSubmit} = reference.props;
                    if (U.isFunction(rxSubmit)) {
                        /*
                         * 关闭防重复提交
                         */
                        reference.setState({
                            $loading: false, $submitting: false
                        });
                        return rxSubmit(result, reference);
                    } else {
                        throw new Error("[ Ex ] wizard调用非法，缺失 rxSubmit主方法");
                    }
                }
            })
        } else {
            throw new Error("[ Ex ] wizard调用非法，缺失 promiseSupplier");
        }
    } else {
        if (U.isFunction(rxFailure)) {
            return rxFailure(() => reference.setState({
                $loading: false, $submitting: false
            }));
        }
    }
};
/**
 * ## 扩展函数
 *
 * 根据 `reference` 执行表单操作
 *
 * ```json
 * {
 *     add: (params) => Promise,
 *     save: (params) => Promise,
 *     remove: (params) => Promise,
 *     filter: (params) => Promise,
 *     query: (params) => Promise,
 *     wizard: (params) => Promise
 * }
 * ```
 *
 * ### 函数说明
 *
 * | 函数名 | 说明 |
 * |:---|:---|
 * | add | 添加表单提交 |
 * | save | 保存表单提交 |
 * | remove | 删除表单提交 |
 * | filter | 高级搜索查询条件处理 |
 * | query | 直接搜索表单处理 |
 * | wizard | 步骤表单提交 |
 *
 * 当前API的框架内部调用代码如：
 *
 * ```js
 * import Ex from 'ex';
 *
 * const $opAdd = (reference) => params => Ex.form(reference).add(params, {
 *      uri: "/api/role",
 *      dialog: "added",
 * });
 * ```
 *
 * @memberOf module:_business
 * @method form
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Object} 返回对象信息
 * */
export default (reference) => ({
    add: add(reference),
    save: save(reference),
    remove: remove(reference),
    filter: filter(reference),
    query: query(reference),
    wizard: wizard(reference),
})