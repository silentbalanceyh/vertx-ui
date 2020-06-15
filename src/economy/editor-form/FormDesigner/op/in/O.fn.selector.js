import Opt from './I.option';
import Ux from 'ux';
import dataAjax from './O.fn.ajax';

export default (normalized = {}, data = {}) => {
    /*
     * 表格配置
     */
    normalized.table = Opt.dataTable(data);

    const config = Ux.valuePath(data, "optionJsx.config");
    if (!Ux.isEmpty(config)) {
        /*
         * 窗口基础配置
         */
        normalized.windowValidation = Ux.valuePath(config, "validation");
        let window = Ux.valuePath(config, "window");
        if (window && "string" === typeof window) {
            window = Ux.aiExprWindow(window);
        }
        if (!Ux.isEmpty(window)) {
            normalized.windowTitle = Ux.valuePath(window, "title");
            normalized.windowWidth = Ux.valuePath(window, "width");
            normalized.windowOk = Ux.valuePath(window, "okText");
            normalized.windowCancel = Ux.valuePath(window, "cancelText");
        }

        /*
         * 搜索专用配置
         */
        const search = Ux.valuePath(config, "search");
        if (!Ux.isEmpty(search)) {
            const searchField = [];
            Object.keys(search).map(key => search[key])
                .forEach(cond => searchField.push(cond));
            normalized.windowSearchField = searchField;
        }
    }

    dataAjax(normalized, data);
}