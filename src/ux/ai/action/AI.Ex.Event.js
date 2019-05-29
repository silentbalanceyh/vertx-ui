import Value from "../../Ux.Value";
import Dialog from '../../Ux.Dialog';
import Cv from "../../cv/Ux.Constant";

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
const getModal = (reference) => {
    const {$addKey} = reference.props;
    return !!$addKey ? "add" : "edit";
};
const ai2Form = (reference, supplier) => (event) => {
    event.preventDefault();
    const modal = getModal(reference);
    const {$options = {}} = reference.props;
    const to = $options['submit.to'];
    return _validated(reference).then(data => {
        /*
         * 提取Mock专用函数
         */
        const {fnMock, fnSubmitting, fnLoading} = reference.props;
        /* 模拟函数 */
        const mockData = fnMock(data);
        /* 表单提交 */
        fnSubmitting();
        /* 加载效果 */
        fnLoading();
        return supplier(data, mockData);
    }).then(response => {
        /* 判断是 Message 还是 Dialog */
        const mode = $options['submit.response'];
        const key = `submit.${modal}.modal`;
        const modalKey = $options[key];
        if ("MESSAGE" === mode) {
            return new Promise((resolve) => {
                Dialog.showMessage(reference, modalKey, null, response);
                resolve(response);
            });
        } else {
            // 默认 DIALOG
            return new Promise((resolve) => Dialog.showDialog(reference, modalKey,
                () => resolve(response), response, null));
        }
    }).then(response => {
        const {fnClose, fnView, fnSubmitting, fnRefresh} = reference.props;
        // 防止编辑按钮的 loading
        fnSubmitting(false);
        if ("add" === modal) {
            if ("EDIT" === to) {
                // 直接进入 EDIT 界面
                fnView(response);
                fnRefresh();
            } else {
                // 默认 LIST
                fnClose();
                fnRefresh();
            }
        } else {
            fnClose();
            fnRefresh();
        }
    });
};
export default {
    ai2Form,
};