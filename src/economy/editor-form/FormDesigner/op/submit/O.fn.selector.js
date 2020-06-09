import Ux from 'ux';
import dataAjax from './O.fn.ajax';

export default (normalized = {}, params = {}) => {
    /*
     * 表格配置
     */
    if (Ux.isArray(params.table)) {
        const table = {columns: []};
        params.table.forEach(row => {
            const col = {};
            col.title = row.title;
            col.dataIndex = row.dataIndex;
            table.columns.push(col);
        });
        normalized.optionJsx.config.table = table;
    }

    /*
     * 窗口基础配置
     */
    if (params.windowValidation) {
        normalized.optionJsx.config.validation = params.windowValidation;
    }
    const window = {};
    if (params.windowTitle) {
        window.title = params.windowTitle;
    }
    if (params.windowWidth) {
        window.width = Ux.valueInt(params.windowWidth, 640);
    } else {
        window.width = 640;
    }
    window.okText = params.windowOk ? params.windowOk : "Yes";
    window.cancelText = params.windowCancel ? params.windowCancel : "No";
    window.maskClosable = false;
    const $window = Ux.valueValid(window);
    if (!Ux.isEmpty($window)) {
        normalized.optionJsx.config.window = $window;
    }

    /*
     * 搜索专用配置
     */
    if (params.windowSearch) {
        if (Ux.isArray(params.windowSearchField) && 0 < params.windowSearchField.length) {
            const search = {};
            params.windowSearchField.forEach(cond => {
                search[`${cond},c`] = cond;
            })
            normalized.optionJsx.config.search = search;
        }
    }
    dataAjax(normalized, params);
}