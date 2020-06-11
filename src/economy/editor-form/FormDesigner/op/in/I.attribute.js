import Ux from 'ux';

export default {
    /*
     * 基础数据部分
     */
    dataField: (normalized = {}, data = {}) => {
        normalized.width = Ux.valuePath(data, "optionItem.style.width");
        normalized.label = Ux.valuePath(data, "optionItem.label");
        normalized.placeholder = Ux.valuePath(data, "optionJsx.placeholder");
        if ("aiTitle" === normalized) {
            normalized.field = Ux.valuePath(data, "title");
        } else {
            normalized.field = Ux.valuePath(data, "field");
        }
    },
    dataBasic: (normalized = {}, data = {}) => {
        /* */
        normalized.readOnly = Ux.valuePath(data, "optionJsx.readOnly");
        normalized.inscribe = Ux.valuePath(data, "optionJsx.inscribe");
        normalized.allowClear = Ux.valuePath(data, "optionJsx.allowClear");
        normalized.maxLength = Ux.valuePath(data, "optionJsx.maxLength");
        normalized.expr = Ux.valuePath(data, "optionJsx.config.expr");
    },
    dataAdorn: (normalized = {}, data = {}) => {
        normalized.suffix = Ux.valuePath(data, "optionJsx.suffix");
        normalized.prefix = Ux.valuePath(data, "optionJsx.prefix");
        normalized.addonBefore = Ux.valuePath(data, "optionJsx.addonBefore");
        normalized.addonAfter = Ux.valuePath(data, "optionJsx.addonAfter");
    }
}