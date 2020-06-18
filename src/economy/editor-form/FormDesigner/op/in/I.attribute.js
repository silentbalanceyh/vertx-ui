import Ux from 'ux';

export default {
    /*
     * 基础数据部分
     */
    dataField: (normalized = {}, data = {}) => {
        normalized.width = Ux.valuePath(data, "optionItem.style.width");
        normalized.label = Ux.valuePath(data, "optionItem.label");
        const placeholder = Ux.valuePath(data, "optionJsx.placeholder");
        if (Ux.isArray(placeholder)) {
            const [placeholderLeft, placeholderRight] = placeholder;
            normalized.placeholderLeft = placeholderLeft;
            normalized.placeholderRight = placeholderRight;
        } else {
            normalized.placeholder = placeholder;
        }
        if ("aiTitle" === normalized) {
            normalized.field = Ux.valuePath(data, "title");
        } else {
            const fieldStr = Ux.valuePath(data, "field");
            if (fieldStr) {
                if (0 < fieldStr.indexOf(',')) {
                    const fields = fieldStr.split(',');
                    const [field, __condition] = fields;
                    normalized.field = field;
                    normalized.__condition = __condition;
                } else {
                    normalized.field = fieldStr;
                }
            }
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