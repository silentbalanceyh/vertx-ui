import E from '../error';
import Abs from '../abyss';
import Dev from '../develop'
import Cv from "../constant";
import Ele from '../element';
import Amt from "./O.ambient";

/**
 * ## 特殊函数「Zero」
 *
 * Ant Design中的表单提交函数，返回最终的表单提交数据值。
 *
 * @memberOf module:_ant
 * @async
 * @param {ReactComponent} reference React组件引用，必须绑定过 Ant 中的 Form。
 * @param {boolean} redux 是否执行 redux 提交。
 * @return {Promise<T>} 返回最终的表单提交数据值。
 */
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
            Object.keys(data)
                .filter(key => key.startsWith("$"))
                .forEach(key => delete data[key])
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
/**
 * ## 特殊函数「Zero」
 *
 * Ant Design提交表单被规范化过后的数据。
 *
 * 1. 注入默认语言信息，`Cv['Language']`读取语言信息，默认`cn`。
 * 2. 如果记录中不包含`active`字段，则注入默认的 active。
 * 3. 如果包含了应用数据，则将应用的 `sigma` 注入到请求数据中。
 * 4. 移除掉所有的 undefined 节点。
 *
 * @memberOf module:_value
 * @param {Object} params 输入数据值。
 * @return {Object} 被处理过后的请求数据值。
 */
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
    return Ele.valueValid(data);
};
export default {
    formSubmit,
    valueRequest,
}