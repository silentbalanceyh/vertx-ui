import Cm from './gen.common';

const ARGS = {
    inError: false
};
export default {
    /**
     * ## 扩展函数
     *
     * 主要用于调用上层函数
     *
     * 1. 调用 props 中的某个函数
     * 2. 调用 state 中的某个函数
     * 3. 最后执行该函数
     *
     * ```js
     *     return Ex.I.todo(request, false)
     *          .then(Ux.ajax2Dialog(ref, buildConfig(ref, "rejected"), true))
     *
     *              // 调用代码
     *              .then(response => Ex.rx(reference).close(response));
     * ```
     *
     * 返回的数据结构如下：
     *
     * | 函数名 | 调用函数 | 说明 |
     * |:---|:---|:---|
     * | openPost | rxPostOpen | 打开Tab页后的执行函数 |
     * | closePost | rxPostClose | 关闭Tab页后的执行函数 |
     * | assistIn | rxAssist | 辅助数据输入函数 |
     * | assistOut | rxAssist | 辅助数据输出函数 |
     * | search | rxSearch | 搜索专用函数 |
     * | condition | rxCondition | 条件处理专用函数 |
     * | filter | rxFilter | 查询条件专用函数 |
     * | projection | rxProjection | 列过滤专用函数 |
     * | selected | rxSelected | 多选专用函数 |
     * | delete | rxDelete | 单行删除专用函数 |
     * | batchEdit | rxBatchEdit | 批量更新专用函数 |
     * | view | rxView | 单行查看专用函数 |
     * | open | rxOpen | 打开页面专用函数 |
     * | close | rxClose | 关闭页面专用函数 |
     * | loading | doLoading | 加载状态处理函数 |
     * | dirty | doDirty | 脏状态处理函数 |
     * | submitting | doSubmitting | 提交状态专用函数 |
     * | submittingStrict | doSubmitting | 提交状态专用函数（带错误信息） |
     *
     * @memberOf module:_rx
     * @param {ReactComponent} reference React对应组件引用
     * @param {boolean} off 关闭错误信息
     * @returns {Object} 返回最终对象
     * */
    rx: (reference, off = false) => ({
        /*
        column: (full = true) => full ?
            // 读取全列
            Cm.seek(reference, 'rxColumn')([]) :
            // 读取我的列
            Cm.seek(reference, 'rxColumnMy')([]), */
        openPost: (data) =>
            Cm.seek(reference, 'rxPostOpen', ARGS)([data]),
        closePost: (key) =>
            Cm.seek(reference, 'rxPostClose', ARGS)([key]),
        // ------------ 辅助数据专用 --------
        assistIn: (key, data) =>
            Cm.seek(reference, 'rxAssist', ARGS)([key, data, false]),
        assistOut: (key, data) =>
            Cm.seek(reference, 'rxAssist', ARGS)([key, data, true]),
        // ------------ 处理开关页 ----------
        /* 主搜索方法 */
        search: (params) =>
            Cm.seek(reference, 'rxSearch')([params]),
        /* 更改 $condition */
        condition: (condition = {}) =>
            Cm.seek(reference, 'rxCondition')([condition]),
        /* 更改 $filters */
        filter: (filters = {}, filtersRaw) =>
            Cm.seek(reference, "rxFilter")([filters, filtersRaw]),
        /* 更改 $columnsMy */
        projection: (columnsMy = [], addOn = {}) =>
            Cm.seek(reference, 'rxProjection')([columnsMy, addOn]),
        // ------------ 行操作 ---------------
        /* 更改 $selected */
        selected: (selected = [], data = []) =>
            Cm.seek(reference, 'rxSelected')([selected, data]),
        /* Ajax 单行删除 */
        delete: (id, callback) =>
            Cm.seek(reference, 'rxDelete')([id, callback]),
        /* Ajax 批量更新 */
        batchEdit: (params = []) =>
            Cm.seek(reference, 'rxBatchEdit')([params]),
        /* Ajax 单行查看 */
        view: (id) =>
            Cm.seek(reference, 'rxView')([id]),
        // ------------ 打开 -----------------
        /* 打开新窗口 */
        open: (id, data, record) =>
            Cm.seek(reference, 'rxOpen')([id, data, record]),
        /* 窗口记录 关闭方法调用 */
        close: (data = {}, addOn) =>
            Cm.seek(reference, 'rxClose', {
                inError: !off,      // 特殊处理
            })([data, addOn]),
        // ------------ 状态 -----------------
        /* loading */
        loading: (loading = true, addOn = {}) =>
            Cm.seek(reference, 'doLoading', ARGS)([loading, addOn]),
        /* dirty */
        dirty: (dirty = true, addOn = {}) =>
            Cm.seek(reference, 'doDirty', ARGS)([dirty, addOn]),
        /* submitting */
        submitting: (submitting = true, addOn = {}) =>
            Cm.seek(reference, 'doSubmitting', ARGS)([submitting, addOn]),
        submittingStrict: (submitting = true, addOn = {}) =>
            Cm.seek(reference, 'doSubmitting')([submitting, addOn]),
    })
}