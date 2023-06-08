import Ux from 'ux';

const form = (reference) => ({
    addFn: (uri, preAdd) => (params) => {
        let request = Ux.valueRequest(params);
        const {$addKey} = reference.props;
        request.key = $addKey;
        request = Ux.valueValid(request);
        if (Ux.isFunction(preAdd)) {
            request = preAdd(request, reference);
        }
        if (request) {
            return Ux.ajaxPost(uri, request);
        } else {
            console.error("不触发后端请求开发调试！！Add")
        }
    },
    saveFn: (uri, preEdit) => (params) => {
        const {$inited = {}} = reference.props;
        // 先将表单有的值合并到初始值
        const input = Object.assign({}, $inited, params);
        let request = Ux.valueRequest(input);
        request = Ux.valueValid(request);
        if (Ux.isFunction(preEdit)) {
            request = preEdit(request, reference);
        }
        if (request) {
            return Ux.ajaxPut(uri, request);
        } else {
            console.error("不触发后端请求开发调试！！Edit")
        }
    },
    removeFn: (uri) => (params) => {
        const input = {key: params.key};
        return Ux.ajaxDelete(uri, input)
    },
    add: (params = {}, config = {}) => {
        let request = Ux.valueRequest(params);
        const {$addKey} = reference.props;
        request.key = $addKey;
        request = Ux.valueValid(request);
        return Ux.ajaxPost(config.uri, request)
            .then(Ux.ajax2Dialog(reference, config.dialog))
            .then(response => Ux.of(reference)._.close(response))
            .catch(error => Ux.ajaxError(reference, error));
    },
    save: (params = {}, config = {}) => {
        const {$inited = {}} = reference['props'];
        // 先将表单有的值合并到初始值
        const input = Object.assign({}, $inited, params);
        let request = Ux.valueRequest(input);
        request = Ux.valueValid(request);
        return Ux.ajaxPut(config.uri, request)
            .then(Ux.ajax2Dialog(reference, config.dialog))
            .then(response => Ux.of(reference)._.close(response))
            .catch(error => Ux.ajaxError(reference, error));
    },
    remove: (params = {}, config = {}) => {
        const input = {key: params.key};
        return Ux.ajaxDelete(config.uri, input)
            .then(Ux.ajax2Dialog(reference, config.dialog))
            .then(Ux.ajax2True(
                () => Ux.of(reference)._.close(params, {
                    $selected: []
                })
            ))
            .catch(error => Ux.ajaxError(reference, error));
    },
    filter: (params = {}) => {
        const {connector = "AND", ...rest} = params;
        const request = Ux.qrForm(rest, connector, reference)
        Object.keys(rest).forEach(field => {
            const requestV = rest[field];
            if (undefined === requestV) {
                request[field] = Ux.Env.CV_DELETE;
            } else if (Ux.isArray(requestV)) {
                if (0 === requestV.length) {
                    request[field] = Ux.Env.CV_DELETE;
                }
            }
        })
        return Ux.of(reference)._.qrFilter(request)
            .then(response => Ux.of(reference)._.close(rest, response))
            .catch(error => Ux.ajaxError(reference, error));
        // __Zn.?x(reference).filter(values, params);    // 维持数据专用
        // return Ux.promise(values)
        //     .then(response => __Zn.?x(reference).close(response))
        //     .catch(error => Ux.ajaxError(reference, error));
    },
    query: (params = {}, filters = {}) => {
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
    },
    wizard: (params, promiseSupplier) => {
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
            if (Ux.isFunction(promiseSupplier)) {
                const promise = promiseSupplier(request);
                return promise.then(result => {
                    if (!result || 0 === result.length) {
                        if (Ux.isFunction(rxFailure)) {
                            rxFailure(() => {
                                Ux.of(reference).load().done();
                                // reference.?etState({
                                //     $loading: false, $submitting: false
                                // })
                            }, false);
                        }
                    } else {
                        const {rxSubmit} = reference.props;
                        if (Ux.isFunction(rxSubmit)) {
                            /*
                             * 关闭防重复提交
                             */
                            return Ux.of(reference).load().future(() => {

                                return rxSubmit(result, reference);
                            })
                            // reference.?etState({
                            //     $loading: false, $submitting: false
                            // });
                            // return rxSubmit(result, reference);
                        } else {
                            throw new Error("[ Ex ] wizard调用非法，缺失 rxSubmit主方法");
                        }
                    }
                })
            } else {
                throw new Error("[ Ex ] wizard调用非法，缺失 promiseSupplier");
            }
        } else {
            if (Ux.isFunction(rxFailure)) {
                return rxFailure(() => {
                    Ux.of(reference).load().done();
                    // reference.?etState({
                    //     $loading: false, $submitting: false
                    // })
                });
            }
        }
    },
});
export default {
    form,
}