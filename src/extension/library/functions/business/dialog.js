import Ux from 'ux';
import Fn from "../generator";
import U from 'underscore';

const add = (reference) => (params = {}, config = {}) => {
    let request = Ux.valueRequest(params);
    request = Ux.valueValid(request);
    return Ux.ajaxPost(config.uri, request)
        .then(Ux.ajax2Message(reference, config.dialog))
        .then(response => {
            Fn.rx(reference).close(response);
            return Ux.promise(response);
        })
};

const save = (reference) => (params = {}, config = {}) => {
    let request = Ux.valueRequest(params);
    request = Ux.valueValid(request);
    return Ux.ajaxPut(config.uri, request)
        .then(Ux.ajax2Message(reference, config.dialog))
        .then(response => {
            Fn.rx(reference).close(response);
            return Ux.promise(response);
        })
};

const saveRow = (reference) => (params = {}, config = {}) => {
    let request = Ux.valueRequest(params);
    const {doRow} = reference.props;
    if (U.isFunction(doRow)) {
        const {$mode = ""} = reference.props;
        if (Ux.Env.FORM_MODE.ADD === $mode) {
            /*
             * 重置当前表单
             */
            Ux.formReset(reference);
            /*
             * 根据初始值需要得到一条新数据
             */
            let {$inited = {}} = reference.props;
            $inited = Ux.clone($inited);
            $inited.key = Ux.randomUUID();
            /*
             * 变更 key
             */
            doRow(request, {
                $submitting: false, // 关闭提交
                $inited,            // 继续添加，处于添加模式比较特殊
            });
        } else {
            doRow(request, {
                $visible: false, // 关闭窗口
                $submitting: false, // 关闭提交
            });
        }
        /*
         * 提交专用（防止重复提交问题）
         */
        reference.setState({$loading: false});
    } else {
        throw new Error("[ Ux ] 缺失核心函数 doRow()");
    }
    return Ux.promise(request);
};
const saveSelected = (reference) => (data = []) => {
    const {doRows} = reference.props;
    if (U.isFunction(doRows)) {
        doRows(data, {
            $visible: false, // 关闭窗口
        })
    } else {
        throw new Error("[ Ux ] 缺失核心函数 doRow()");
    }
};
/**
 * ## 扩展函数
 *
 * 根据 `reference` 执行窗口操作
 *
 * ```json
 * {
 *     add: (data) => Promise,
 *     save: (data) => Promise,
 *     saveRow: (data) => Promise,
 *     saveSelected: (data) => Promise
 * }
 * ```
 *
 * ### 函数说明
 *
 * | 函数名 | 说明 |
 * |:---|:---|
 * | add | 窗口添加执行 |
 * | save | 窗口保存执行 |
 * | saveRow | 保存当前行 |
 * | saveSelected | 保存当前窗口选择的 |
 *
 * 当前API的框架内部调用代码如：
 *
 * ```js
 * import Ex from 'ex';
 *
 * const $opSaveField = (reference) => params =>
 *      Ex.dialog(reference).saveRow(params);
 * ```
 *
 * @memberOf module:_business
 * @method dialog
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Object} 返回对象信息
 * */
export default (reference) => ({
    add: add(reference),
    save: save(reference),
    saveRow: saveRow(reference),
    saveSelected: saveSelected(reference)
})