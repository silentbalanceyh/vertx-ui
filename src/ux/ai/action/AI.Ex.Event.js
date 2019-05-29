import Value from "../../Ux.Value";
import Cv from "../../cv/Ux.Constant";
import U from 'underscore';

const _normalizeValue = (data = {}, reference) => {
    // 先拷贝一份新的数据
    const params = Value.clone(data);
    // 参数注入语言
    params.language = Cv["LANGUAGE"];
    // 应用数据处理
    const {$app} = reference.props;
    if ($app && $app.is()) {
        // 专用sigma处理
        const sigma = $app._("sigma");
        if (sigma) params.sigma = sigma;
    }
    // active专用：双引用
    params.active = !!params.active;
    const {$addKey} = reference.props;
    if ($addKey) {
        params.key = $addKey;
    }
    return params;
};
const _validated = (reference) => new Promise((resolve, reject) => {
    const {form} = reference.props;
    form.validateFieldsAndScroll((error, values) => {
        if (error) {
            // 防重复提交
            reject(error);
        } else {
            const params = _normalizeValue(values, reference);
            resolve(params);
        }
    });
});
const ai2Form = (reference, supplier) => (event) => {
    event.preventDefault();
    return _validated(reference).then(data => {
        /*
         * 提取Mock专用函数
         */
        const {fnMock, fnLoading} = reference.props;
        let mockData = {};
        if (U.isFunction(fnMock)) {
            mockData = fnMock(data)
        }
    });
};
export default {
    ai2Form,
}