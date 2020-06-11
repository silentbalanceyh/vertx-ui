import Ux from 'ux';

const dataDatum = (normalized = {}, data = {}) => {
    const normalizeValue = Ux.valuePath(data, "optionJsx.config");
    if (normalizeValue.hasOwnProperty("datum")) {
        normalized.dataSource = "datum";
        normalized.datumSource = normalizeValue.datum.source;
        normalized.datumKey = normalizeValue.datum.value;
        normalized.datumLabel = normalizeValue.datum.label;
    }
    if (normalizeValue.hasOwnProperty("cascade")) {
        normalized.cascadeEnabled = true;
        normalized.cascadeSource = normalizeValue.cascade.source;
        normalized.cascadeValue = normalizeValue.cascade.target;
    }
    if (normalizeValue.hasOwnProperty("expr")) {
        normalized.expr = normalizeValue.expr;
    }
}
export default {
    dataOption: (normalized = {}, data = {}) => {
        const normalizeValue = Ux.valuePath(data, "optionJsx.config");
        if (!Ux.isEmpty(normalizeValue)) {
            // 静态数据源
            if (normalizeValue.hasOwnProperty("items")) {
                normalized.dataSource = "items";
                const options = [];
                if (Ux.isArray(normalizeValue.items)) {
                    normalizeValue.items.forEach(item => {
                        const option = {};
                        option.key = item.key;
                        option.label = item.label;
                        option.name = item.key;
                        options.push(option);
                    })
                }
                normalized.items = options;
            }
            // 动态数据源
            else {
                dataDatum(normalized, data);
            }
        }
    },
    dataDatum,
}