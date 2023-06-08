import __Zn from '../zero.uca.dependency';

const dataDatum = (normalized = {}, data = {}) => {
    const normalizeValue = __Zn.valuePath(data, "optionJsx.config");
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
        const table = __Zn.valuePath(data, "optionJsx.config.table");
        if (!__Zn.isEmpty(table)) {
            return table;
        } else return null;
    },
    dataDate: (normalized = {}, data = {}) => {
        // disabledDate 处理
        const disabledDate = __Zn.valuePath(data, "optionJsx.disabledDate");
        if (disabledDate) {
            normalized.disabledDate = true;
        }
        // 时间模式
        normalized.format = __Zn.valuePath(data, "optionJsx.format");
        normalized.showToday = __Zn.valuePath(data, "optionJsx.showToday");
        normalized.showTime = __Zn.valuePath(data, "optionJsx.showTime");
        // 模式选择
        normalized.dateMode = __Zn.valuePath(data, "optionJsx.mode");
        normalized.use12Hours = __Zn.valuePath(data, "optionJsx.use12Hours");
        normalized.hourStep = __Zn.valuePath(data, "optionJsx.hourStep");
        normalized.minuteStep = __Zn.valuePath(data, "optionJsx.minuteStep");
        normalized.secondStep = __Zn.valuePath(data, "optionJsx.secondStep");
    },
    dataMultiple: (normalized = {}, data = {}) => {
        // 多选读取
        normalized.multipleMode = __Zn.valuePath(data, "optionJsx.mode");
        normalized.maxTagCount = __Zn.valuePath(data, "optionJsx.maxTagCount");
    },
    dataOption: (normalized = {}, data = {}) => {
        const normalizeValue = __Zn.valuePath(data, "optionJsx.config");
        if (!__Zn.isEmpty(normalizeValue)) {
            // 静态数据源
            if (normalizeValue.hasOwnProperty("items")) {
                normalized.dataSource = "items";
                const options = [];
                if (__Zn.isArray(normalizeValue.items)) {
                    const $items = __Zn.aiExprOption(normalizeValue.items);
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
        const tree = __Zn.valuePath(data, "optionJsx.config.tree");
        if (!__Zn.isEmpty(tree)) {
            // 树型读取
            normalized.treeSelection = __Zn.valuePath(data, "optionJsx.config.selection");
            normalized.treeKey = __Zn.valuePath(tree, "key");
            normalized.treeParent = __Zn.valuePath(tree, "parent");
            normalized.treeText = __Zn.valuePath(tree, "text");
            normalized.treeValue = __Zn.valuePath(tree, "value");
            normalized.treeSort = __Zn.valuePath(tree, "sort");
            normalized.treeLeaf = __Zn.valuePath(tree, "leaf");
        }
    }
}