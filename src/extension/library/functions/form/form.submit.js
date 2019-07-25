import Ux from "ux";
import E from '../debug/error';
import Fn from '../global/async';

const xtParam = (params = {}) => {
    // 执行默认参数处理
    const data = Ux.clone(params);
    /* 记录中的语言信息 */
    data.language = Ux.Env['LANGUAGE'];
    if (!data.hasOwnProperty('active')) {
        /* 默认记录启用 */
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
const xtOp = (reference, executor = {}) => (event) => {
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
            const data = xtParam(params);
            /*
             * success 处理
             */
            return Fn.promise(executor.success, data)
            /*
             * Error
             */.catch(error => Fn.failure(reference, error));
        })
        /*
         * Error
         */.catch(error => Fn.failure(reference, error));
    } else {
        /*
         * Error
         */
        return E.error002().catch(error => Fn.failure(reference, error));
    }
};

export default {
    xtOp,
    xtParam
}