import Ux from 'ux';

const dataDatum = (normalized = {}, data = {}) => {
    const normalizeValue = Ux.valuePath(data, "optionJsx.config");
    if (normalizeValue) {
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
    }
}
export default {
    dataTable: (data = {}) => {
        const table = Ux.valuePath(data, "optionJsx.config.table");
        if (!Ux.isEmpty(table)) {
            return table;
        } else return null;
    },
    dataDate: (normalized = {}, data = {}) => {
        // disabledDate 处理
        const disabledDate = Ux.valuePath(data, "optionJsx.disabledDate");
        if (disabledDate) {
            normalized.disabledDate = true;
        }
        // 时间模式
        normalized.format = Ux.valuePath(data, "optionJsx.format");
        normalized.showToday = Ux.valuePath(data, "optionJsx.showToday");
        normalized.showTime = Ux.valuePath(data, "optionJsx.showTime");
        // 模式选择
        normalized.dateMode = Ux.valuePath(data, "optionJsx.mode");
        normalized.use12Hours = Ux.valuePath(data, "optionJsx.use12Hours");
        normalized.hourStep = Ux.valuePath(data, "optionJsx.hourStep");
        normalized.minuteStep = Ux.valuePath(data, "optionJsx.minuteStep");
        normalized.secondStep = Ux.valuePath(data, "optionJsx.secondStep");
    },
    dataMultiple: (normalized = {}, data = {}) => {
        // 多选读取
        normalized.multipleMode = Ux.valuePath(data, "optionJsx.mode");
        normalized.maxTagCount = Ux.valuePath(data, "optionJsx.maxTagCount");
    },
    dataOption: (normalized = {}, data = {}) => {
        const normalizeValue = Ux.valuePath(data, "optionJsx.config");
        if (!Ux.isEmpty(normalizeValue)) {
            // 静态数据源
            if (normalizeValue.hasOwnProperty("items")) {
                normalized.dataSource = "items";
                const options = [];
                if (Ux.isArray(normalizeValue.items)) {
                    const $items = Ux.aiExprOption(normalizeValue.items);
                    $items.forEach(item => {
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
    dataTree: (normalized = {}, data = {}) => {
        const tree = Ux.valuePath(data, "optionJsx.config.tree");
        if (!Ux.isEmpty(tree)) {
            // 树型读取
            normalized.treeSelection = Ux.valuePath(data, "optionJsx.config.selection");
            normalized.treeKey = Ux.valuePath(tree, "key");
            normalized.treeParent = Ux.valuePath(tree, "parent");
            normalized.treeText = Ux.valuePath(tree, "text");
            normalized.treeValue = Ux.valuePath(tree, "value");
            normalized.treeSort = Ux.valuePath(tree, "sort");
            normalized.treeLeaf = Ux.valuePath(tree, "leaf");
        }
    }
}