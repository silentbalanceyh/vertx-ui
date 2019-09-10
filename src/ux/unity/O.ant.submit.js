import E from '../error';
import Abs from '../abyss';
import Dev from '../develop'
import Cv from "../constant";
import Amt from "./O.ambient";

const formSubmit = (reference, redux = false) => {
    // 提取 Form
    const {form} = reference.props;
    if (form) {
        return new Promise((resolve, reject) => form.validateFieldsAndScroll((error, values) => {
            // 执行 values
            if (error) {
                const data = {};
                data.error = error;
                data.client = true;
                reject({data});
            }
            resolve(values);
        })).then((params) => {
            // 拷贝参数
            const data = Abs.clone(params);
            /*
             * 成功处理
             */
            Dev.dgDebug(data, "[ Ux ] 表单提交数据：", "#228B22");
            return Abs.promise(data);
        });
    } else {
        return E.fxReject(10020);
    }
};
const valueRequest = (params = {}) => {
    // 执行默认参数处理
    const data = Abs.clone(params);
    /* 记录中的语言信息 */
    data.language = Cv['LANGUAGE'];
    if (!data.hasOwnProperty('active')) {
        /* 默认记录启用 */
        data.active = true;
    }
    /*
     * 三个头部参数提取，仅保留 sigma 参数，其余两个参数不在此处体现
     * X-App-Id, X-App-Key, X-Sigma
     */
    const app = Amt.isInit();
    if (app && app.sigma) {
        // 双字段处理
        data.sigma = app.sigma;
    }
    return data;
};
export default {
    formSubmit,
    valueRequest,
}