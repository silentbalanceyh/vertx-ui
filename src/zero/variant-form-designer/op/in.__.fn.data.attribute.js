import __Zn from '../zero.uca.dependency';

export default {
    /*
     * 基础数据部分
     */
    dataField: (normalized = {}, data = {}) => {
        normalized.width = __Zn.valuePath(data, "optionItem.style.width");
        normalized.label = __Zn.valuePath(data, "optionItem.label");
        const placeholder = __Zn.valuePath(data, "optionJsx.placeholder");
        if (__Zn.isArray(placeholder)) {
            const [placeholderLeft, placeholderRight] = placeholder;
            normalized.placeholderLeft = placeholderLeft;
            normalized.placeholderRight = placeholderRight;
        } else {
            normalized.placeholder = placeholder;
        }
        if ("aiTitle" === normalized) {
            normalized.field = __Zn.valuePath(data, "title");
        } else {
            const fieldStr = __Zn.valuePath(data, "field");
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
        normalized.readOnly = __Zn.valuePath(data, "optionJsx.readOnly");
        normalized.inscribe = __Zn.valuePath(data, "optionJsx.inscribe");
        normalized.allowClear = __Zn.valuePath(data, "optionJsx.allowClear");
        normalized.maxLength = __Zn.valuePath(data, "optionJsx.maxLength");
        normalized.expr = __Zn.valuePath(data, "optionJsx.config.expr");
    },
    dataAdorn: (normalized = {}, data = {}) => {
        normalized.suffix = __Zn.valuePath(data, "optionJsx.suffix");
        normalized.prefix = __Zn.valuePath(data, "optionJsx.prefix");
        normalized.addonBefore = __Zn.valuePath(data, "optionJsx.addonBefore");
        normalized.addonAfter = __Zn.valuePath(data, "optionJsx.addonAfter");
    }
}