import Opt from './in.__.fn.data.option';
import dataAjax from './in.@fn._.data.ajax';
import __Zn from '../zero.uca.dependency';

export default (normalized = {}, data = {}) => {
    /*
     * 表格配置
     */
    normalized.table = Opt.dataTable(data);

    const config = __Zn.valuePath(data, "optionJsx.config");
    if (!__Zn.isEmpty(config)) {
        /*
         * 窗口基础配置
         */
        normalized.windowValidation = __Zn.valuePath(config, "validation");
        let window = __Zn.valuePath(config, "window");
        if (window && "string" === typeof window) {
            window = __Zn.aiExprWindow(window);
        }
        if (!__Zn.isEmpty(window)) {
            normalized.windowTitle = __Zn.valuePath(window, "title");
            normalized.windowWidth = __Zn.valuePath(window, "width");
            normalized.windowOk = __Zn.valuePath(window, "okText");
            normalized.windowCancel = __Zn.valuePath(window, "cancelText");
        }

        /*
         * 搜索专用配置
         */
        const search = __Zn.valuePath(config, "search");
        if (!__Zn.isEmpty(search)) {
            const searchField = [];
            Object.keys(search).map(key => search[key])
                .forEach(cond => searchField.push(cond));
            normalized.windowSearchField = searchField;
        }
    }

    dataAjax(normalized, data);
}