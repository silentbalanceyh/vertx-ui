import __Zn from '../zero.uca.dependency';

export default {
    dataNorm: (normalized = {}, data = {}) => {
        const normalizeValue = __Zn.valuePath(data, "optionConfig.normalize");
        if (normalizeValue) {
            const splitted = normalizeValue.split(',');
            const [normalize, normalizeLength, normalizePrecision] = splitted;
            normalized.normalize = normalize;
            normalized.normalizeLength = normalizeLength;
            normalized.normalizePrecision = normalizePrecision;
        }
    },
    dataImpact: (normalized = {}, data = {}) => {
        const impact = __Zn.valuePath(data, "optionJsx.depend.impact");
        if (impact) {
            const {reset = []} = impact;
            normalized.impactReset = reset;
        }
        /*
         * linker触发器
         */
        const linker = __Zn.valuePath(data, "optionJsx.config.linker");
        if (!__Zn.isEmpty(linker)) {
            const linkerData = [];
            Object.keys(linker).forEach(key => {
                const itemData = {};
                itemData.key = __Zn.randomUUID();
                itemData.dataFrom = key;
                itemData.dataTo = linker[key];
                linkerData.push(itemData);
            });
            normalized.linker = linkerData;
        }
    },
    dataEnabled: (normalized = {}, data = {}) => {
        const enabled = __Zn.valuePath(data, "optionJsx.depend.enabled");
        if (!__Zn.isEmpty(enabled)) {
            /* 启用规则 */
            normalized.dependEnabled = true;
            /* 遍历字段信息（目前配置层只处理一个字段）*/
            const keys = Object.keys(enabled);
            if (1 === keys.length) {
                /* 字段名 */
                const field = keys[0];
                normalized.dependField = field;
                /* 字段值 */
                const value = enabled[field];
                if (value) {
                    if ("boolean" === typeof value) {
                        /* 布尔值 */
                        normalized.dependType = "BOOLEAN";
                        normalized.dependBoolean = value;
                    } else if (__Zn.isArray(value)) {
                        /* 数组值 */
                        normalized.dependType = "ENUM";
                        normalized.dependEnum = value;
                    } else {
                        /* 动态值 */
                        normalized.dependType = "DATUM";
                        normalized.dependSource = value.source;
                        normalized.dependCondition = value.field;
                        normalized.dependValue = value.value;
                    }
                }
            }
        }
    }
}