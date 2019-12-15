import Cm from './gen.common';

const ARGS = {
    inError: false
};

export default {
    rx: (reference) => ({
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
        selected: (selected = []) =>
            Cm.seek(reference, 'rxSelected')([selected]),
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
        open: (id, data) =>
            Cm.seek(reference, 'rxOpen')([id, data]),
        /* 窗口记录 关闭方法调用 */
        close: (data = {}, addOn) =>
            Cm.seek(reference, 'rxClose')([data, addOn]),
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