/*
 * ExForm 专用 Op 生成器
 * supplier 必须是 Promise 生成器，构造出Promise专用
 */
import Ux from "ux";
import U from "underscore";
import Fn from "../functions";
/*
 * 必须生成 Promise
 */
const _applyPromise = (supplier, params = {}) => {
    if (U.isFunction(supplier)) {
        /*
         * supplier调用处理 Promise
         */
        const promise = supplier(params);
        if (promise instanceof Promise) {
            return promise;
        } else {
            return Fn.error003();
        }
    } else {
        return Fn.error003();
    }
};
const _applyParams = (params = {}) => {
    // 执行默认参数处理
    const data = Ux.clone(params);
    /*
     * 记录中的语言信息
     */
    data.language = Ux.Env['LANGUAGE'];
    if (!data.hasOwnProperty('active')) {
        /*
         * 默认记录启用
         */
        data.active = true;
    }
    /*
     * 三个头部参数提取，仅保留 sigma 参数，其余两个参数不在此处体现
     * X-App-Id, X-App-Key, X-Sigma
     */
    const app = Ux.isInit();
    if (app && app.sigma) {
        data.sigma = app.sigma;
    }
    return data;
};
const _applyError = (reference, error = {}) => {
    const {data = {}} = error;
    if (data.info) {
        /*
         * 弹框处理
         */
    }
    console.info(data);
    reference.setState({$loading: false});
};
/*
 * 特殊流程函数
 */
const generateOp = (reference, executor = {}) => (event) => {
    event.preventDefault();
    // 提交处理
    reference.setState({$loading: true});
    // 提取Form
    const {form} = reference.props;
    if (form) {
        return new Promise((resolve, reject) => {
            // 执行 values 的提取
            form.validateFieldsAndScroll((error, values) => {
                if (error) {
                    reject(error);
                }
                resolve(values);
            })
        }).then((params) => {
            /*
             * 参数准备
             */
            const data = _applyParams(params);
            /*
             * success 处理
             */
            return _applyPromise(executor.success, data)
            /*
             * Error
             */.catch(error => _applyError(reference, error));
        })
        /*
         * Error
         */.catch(error => _applyError(reference, error));
    } else {
        /*
         * Error
         */
        return Fn.error002().catch(error => _applyError(reference, error));
    }
};
export default {
    generateOp,
}