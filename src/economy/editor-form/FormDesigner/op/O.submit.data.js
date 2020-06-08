import Ux from 'ux';

const dataJsx = (to = {}, from = {}, field) => {
    if (from[field]) {
        to.optionJsx[field] = from[field];
    }
}
export default {
    dataInit: (normalized = {}, params = {}) => {
        /*
         * normalized.field 可不设置
         * normalized.optionJsx 初始化
         * normalized.optionItem 初始化
         * normalized.optionConfig 初始化
         */
        normalized.optionJsx = {config: {}, depend: {}};
        normalized.optionItem = {};
        normalized.optionConfig = {};
    },
    /*
     * 基础数据部分
     */
    dataField: (normalized = {}, params = {}) => {
        normalized.optionItem.label = params.label;
        // 是否设置了宽度
        if (params.width) {
            normalized.optionItem.style = {width: params.width};
        }
        // 字段信息设置
        if ("aiTitle" === params.render) {
            normalized.title = params.field;
        } else if ("aiAction" === params.render) {
            normalized.field = "$button";
        } else {
            normalized.field = params.field;
        }
        // 水印文字处理
        dataJsx(normalized, params, 'placeholder');
    },
    dataBasic: (normalized = {}, params = {}) => {
        // 是否只读
        dataJsx(normalized, params, 'readOnly');
        // 只读文字
        dataJsx(normalized, params, 'inscribe');
        // 是否允许清空
        dataJsx(normalized, params, 'allowClear');
        // 最大长度
        dataJsx(normalized, params, 'maxLength');
    },
    dataAdorn: (normalized = {}, params = {}) => {
        // 文字前后缀
        dataJsx(normalized, params, 'suffix');
        dataJsx(normalized, params, "prefix");
        // addon 前后缀
        dataJsx(normalized, params, "addonAfter");
        dataJsx(normalized, params, "addonBefore");
    },
    /*
     * normalize 设置专用
     */
    dataNorm: (normalized = {}, params = {}) => {
        if (params.normalize) {
            if ("unlimited" !== params.normalize) {
                /*
                 * 有限制的情况
                 */
                const fnName = params.normalize;
                let literal = fnName;
                fnName += `,${Ux.valueInt(params.normalizeLength, 10)}`;
                /*
                 * 如果是 decimal，必须是浮点数
                 */
                if ("decimal" === params.normalizePrecision) {
                    fnName += `,${Ux.valueInt(params.normalizePrecision, 10)}`
                }
                /*
                 * 特殊填写
                 */
                normalized.optionConfig.normalize = fnName;
            }
        }
    },
    dataImpact: (normalized = {}, params = {}) => {
        normalized.optionJsx.depend.impact = {};
        if (Ux.isArray(params.impactReset) && 0 < params.impactReset.length) {
            const filtered = params.impactReset.filter(item => !!item);
            normalized.optionJsx.depend.impact.reset = filtered;
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
                        if (Ux.isArray(value) && 0 < value.length) {
                            normalized.optionJsx.depend.enabled[params.dependField] = value;
                        }
                    }
                } else if ("DATUM" === params.dependType) {
                    if (params.dependSource &&
                        params.dependCondition &&
                        Ux.isArray(params.dependValue)
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
    /*
     * 验证规则专用
     */
    dataRules: (normalized = {}, params = {}) => {
        const rules = {};
        /*
         * 必填规则
         */

    }
}