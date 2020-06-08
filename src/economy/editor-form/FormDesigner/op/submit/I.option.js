import Ux from 'ux';

const dataDatum = (normalized = {}, params = {}) => {
    // 动态数据源
    const datum = {};
    /*
     * source: identifier
     * value:  key
     * label:  name
     */
    if (params.datumSource) {
        datum.source = params.datumSource;
    }
    if (params.datumKey) {
        datum.value = params.datumKey;
    } else {
        datum.value = "key";
    }
    if (params.datumLabel) {
        datum.label = params.datumLabel;
    } else {
        datum.label = "label";
    }
    normalized.optionJsx.config.datum = datum;
    /*
     * 启用过滤
     */
    if (params.cascadeEnabled) {
        if (params.cascadeSource &&
            params.cascadeValue) {

            // 启用过滤
            // 级联配置，source/target
            const cascade = {};
            cascade.source = params.cascadeSource;
            cascade.target = params.cascadeValue;
            normalized.optionJsx.config.cascade = cascade;
        }
    }
}
export default {
    dataMultiple: (normalized = {}, params = {}) => {
        // 多选启用
        if (params.multiple) {
            // 多选模式
            if (params.multipleMode) {
                // 多选 / 标签两种模式
                normalized.optionJsx.mode = params.multipleMode;
                if (1 < params.maxTagCount) {
                    // 多选 Tags 处理
                    normalized.optionJsx.maxTagCount = params.maxTagCount;
                }
            }
        }
    },
    dataOption: (normalized = {}, params = {}) => {
        if (params.dataSource) {
            // 数据源选项配置（静态和动态）
            if ("items" === params.dataSource) {
                // 静态数据源
                const options = [];
                if (Ux.isArray(params.items)) {
                    params.items.forEach(item => {
                        const {key, label} = item;
                        const option = {};
                        option.key = key;
                        option.value = key;
                        option.label = label;
                        options.push(option);
                    })
                }
                normalized.optionJsx.config.items = options;
            } else {
                /* 动态数据源 */
                dataDatum(normalized, params);
            }
        }
    },
    dataDatum,
    dataTree: (normalized = {}, params = {}) => {
        const tree = {};
        if (params.treeKey) {
            tree.key = params.treeKey;
        }
        if (params.treeParent) {
            tree.parent = params.treeParent;
        }
        if (params.treeText) {
            tree.text = params.treeText;
        }
        if (params.treeValue) {
            tree.value = params.treeValue;
        }
        if (params.treeSort) {
            tree.sort = params.treeSort;
        }
        if (params.treeLeaf) {
            tree.leaf = params.treeLeaf;
        }
        normalized.optionJsx.config.tree = tree;
        if (params.treeSelection) {
            normalized.optionJsx.config.selection = params.treeSelection;
        } else {
            normalized.optionJsx.config.selection = "CURRENT";
        }
    },
}