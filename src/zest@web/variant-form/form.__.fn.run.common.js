import __Zn from "./zero.form.dependency";

const Cv = __Zn.Env;

const __runFailure = (error, form, reference) => {
    // v4 的新写法（表单提交拦截）
    const {errorFields = []} = error;
    const hitField = errorFields[0].name;
    form.scrollToField(hitField);
    const data = {};
    const {errors = []} = errorFields[0];
    data.error = errors[0];
    data.field = __Zn.isArray(hitField) ? hitField[0] : hitField;
    data.client = true;

    const {raft = {}} = reference.state;
    const {metadata = {}} = raft;
    const {error_notify = []} = metadata;
    if (error_notify.includes(data.field)) {
        __Zn.messageFailure(data.error, 2);
    }
    return data;
}
const runSubmit = (reference, redux = false) => {
    // 提取 Form, OLD const {form} = reference.props;
    const form = __Zn.v4FormRef(reference);
    if (form) {
        return __Zn.ambFormSubmit(reference).then(() => {
            // 旧版：form.validateFieldsAndScroll
            return form.validateFields().then((validated = {}) => {
                // 拷贝参数
                const request = __Zn.aclSubmit(validated, reference);
                // 执行规则字段@的操作
                const requestData = __Zn.formOut(reference, request);
                __Zn.dgDebug(requestData, "[ Ux ] 表单提交数据：", "#228B22");
                return __Zn.promise(requestData);
            }).catch(error => {
                const data = __runFailure(error, form, reference);
                return Promise.reject({data, redux});
            });
        })
    } else {
        console.error("无法捕捉 form 引用！");
        return __Zn.fxReject(10020);
    }
};

const runEventFn = (reference, config = {}) => {
    const {$op = {}} = reference.state ? reference.state : {};
    const performer = $op[config.key];
    if (__Zn.isFunction(performer)) {
        return performer(reference, config);
        // return __Zn.promise(performer(reference, config));
    } else {
        /* 空函数，防止 then 之后无法调用 */
        if (Cv.TYPE_EVENT.RESET !== config.event) {
            __Zn.dgDebug({
                event: config.event,
                config,
                $op,
            }, "[ Ux ] 未捕捉到对应配置", "red");
        }
        return () => false;
    }
}

const runCallback = (reference, config, response) => {
    const {optionJsx} = config;
    if (optionJsx && optionJsx.callback) {
        /*
         * Two Mode Support
         */
        const executor = {}
        const segments = optionJsx.callback.split(':');
        executor.key = segments[0];
        executor.fn = "M" === segments[1] ? __Zn.ajaxMessage : __Zn.ajaxDialog;
        return executor.fn(reference, {data: response, key: executor.key}).then(() => {
            if (optionJsx.closable) {
                /*
                 * BUG：请检查响应数据，key 值不对应
                 */
                const {$addKey} = reference.props;
                let key = response.key;
                if ($addKey && $addKey !== key) {
                    // 添加模式
                    key = $addKey;
                } else {
                    const {$inited = {}} = reference.props;
                    if ($inited.key && $inited.key !== key) {
                        // 编辑模式，$inited有值时处理（确认前端key和后端key一致）
                        // 前提是前端 key 必须存在
                        key = $inited.key;
                    }
                }
                const closeData = __Zn.clone(response);
                if (__Zn.isArray(closeData)) {
                    // Array Only
                    __Zn.fn(reference).rxClose(closeData);
                } else {
                    // Object
                    __Zn.fn(reference).rxClose({
                        ...closeData,
                        key,
                    });
                }
            }
            return __Zn.promise(response);
        })
    } else {
        return __Zn.promise(response);
    }
}
export default {
    runSubmit,
    runEventFn,
    runCallback,
}