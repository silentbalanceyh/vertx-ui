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
}