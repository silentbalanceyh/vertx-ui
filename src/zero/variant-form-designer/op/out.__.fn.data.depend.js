import __Zn from '../zero.uca.dependency';

export default {
    /*
     * normalize 设置专用
     */
    dataNorm: (normalized = {}, params = {}) => {
        if (params.normalize) {
            if ("unlimited" !== params.normalize) {
                /*
                 * 有限制的情况
                 */
                let literal = params.normalize;
                literal += `,${__Zn.valueInt(params.normalizeLength, 10)}`;
                /*
                 * 如果是 decimal，必须是浮点数
                 */
                if ("decimal" === params.normalizePrecision) {
                    literal += `,${__Zn.valueInt(params.normalizePrecision, 10)}`
                }
                /*
                 * 特殊填写
                 */
                normalized.optionConfig.normalize = literal;
            }
        }
    },
    dataImpact: (normalized = {}, params = {}) => {
        normalized.optionJsx.depend.impact = {};
        if (__Zn.isArray(params.impactReset) && 0 < params.impactReset.length) {
            normalized.optionJsx.depend.impact.reset =
                params.impactReset.filter(item => !!item);
        }
        /*
         * linker触发器
         */
        if (__Zn.isArray(params.linker) && 0 < params.linker.length) {
            const linker = {};
            params.linker.forEach(kv => linker[kv.dataFrom] = kv.dataTo);
            normalized.optionJsx.config.linker = linker;
        }
    },
    dataEnabled: (normalized = {}, params = {}) => {
        if (params.dependEnabled) {
            /* 开启依赖项 */
            normalized.optionJsx.depend.enabled = {};
            /*
             * dependField,
             * dependType
             */
            if (params.dependField && params.dependType &&
                (normalized.field !== params.dependField)) {
                /*
                 * 根据取值信息提取
                 */
                if ("BOOLEAN" === params.dependType) {
                    if (params.hasOwnProperty('dependBoolean')) {
                        normalized.optionJsx.depend.enabled[params.dependField] = params.dependBoolean;
                    }
                } else if ("ENUM" === params.dependType) {
                    if (params.hasOwnProperty('dependEnum')) {
                        const value = params.dependEnum;
                        if (__Zn.isArray(value) && 0 < value.length) {
                            normalized.optionJsx.depend.enabled[params.dependField] = value;
                        }
                    }
                } else if ("DATUM" === params.dependType) {
                    if (params.dependSource &&
                        params.dependCondition &&
                        __Zn.isArray(params.dependValue)
                        && 0 < params.dependValue.length) {
                        const value = {};
                        value.source = params.dependSource;
                        value.field = params.dependCondition;
                        value.value = params.dependValue;
                        normalized.optionJsx.depend.enabled[params.dependField] = value;
                    }
                }
            }
        }
    },
}