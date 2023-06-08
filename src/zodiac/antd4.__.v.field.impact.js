import __FORM from './form.fn.form.action';
import __Zn from './zero.module.dependency';
/*
 * 依赖的触发顺序
 * 1）最先必须是 reset
 * 2）其次可以是其他字段处理
 */
const rules = [
    "reset",
    "duration",
    "evaluate",
    "multiply"
]
const parser = {
    "FORM": (field, value, reference) => __FORM.formHit(reference, field),
    "VALUE": (field, value) => value,
}
const inputValue = (input = {}, configuration = {}) => {
    const {value, reference} = configuration;
    if (__Zn.isObject(input)) {
        const parsed = {};
        Object.keys(input).forEach(field => {
            const expr = input[field];
            if (expr) {
                const split = expr.split(":");
                const type = split[0];
                const fieldTarget = split[1];
                const parseFn = parser[type];
                if (__Zn.isFunction(parseFn)) {
                    parsed[field] = parseFn(fieldTarget, value, reference);
                }
            }
        })
        return parsed;
    } else if (__Zn.isArray(input)) {
        const parsed = [];
        input.forEach(expr => {
            const split = expr.split(":");
            const type = split[0];
            const fieldTarget = split[1];
            const parseFn = parser[type];
            if (__Zn.isFunction(parseFn)) {
                parsed.push(parseFn(fieldTarget, value, reference));
            }
        })
        return parsed;
    } else {
        console.warn("input 配置格式错误，不执行");
        return null;
    }
}
const impactReset = (formValues = {}, configuration = {}) => {
    const {config = []} = configuration;
    if (0 < config.length) {
        config.forEach(field => formValues[field] = undefined);
    }
}
const impactDuration = (formValues = {}, configuration = {}) => {
    const {config = {}} = configuration;
    const {input = {}, mode, target} = config;
    if (target) {
        const parsed = inputValue(input, configuration);
        if (parsed) {
            if (parsed.start && parsed.end) {
                formValues[target] = __Zn.valueDuration(parsed.start, parsed.end, mode);
            } else {
                // 清除生效
                formValues[target] = undefined;
            }
        }
    }
}
const impactRange = (formValues = {}, configuration = {}) => {
    const {config = {}} = configuration;
    const {input = {}, range, target} = config;
    if (target) {
        const parsed = inputValue(input, configuration);
        if (parsed) {
            Object.keys(range).forEach(expr => {
                const checked = __Zn.isRange(parsed.value, expr);
                if (checked) {
                    formValues[target] = range[expr];
                }
            })
            if (!formValues[target]) {
                formValues[target] = undefined;
            }
        }
    }
}
const impactMultiply = (formValues = {}, configuration = {}) => {
    const {config = {}} = configuration;
    const {input = [], target} = config;
    if (target) {
        const parsed = inputValue(input, configuration);
        if (parsed) {
            let multiply = __Zn.mathMultiplication(1, parsed);
            if (multiply) {
                formValues[target] = multiply;
            } else {
                formValues[target] = 0;
            }
        }
    }
}
export default {
    rules,
    /*
     * configuration 数据结构
     * {
     *     "reference": "组件引用",
     *     "config": "当前规则配置",
     *     "value": "当前字段值"
     * }
     * 下边配置对应到表单中的配置：
     *
     */
    ruler: {
        /*
                    "optionJsx.depend.impact": {
                        "reset": [
                            "field1",
                            "field2"
                        ]
                    }
                    该组件执行后重设所有字段
         */
        "reset": impactReset,
        /*
                    "optionJsx.depend.impact": {
                        "duration": {
                            "input": {
                                "start": "VALUE",
                                "end": "FORM:endAt"
                            },
                            "mode": "day",
                            "target": "days"
                        }
                    },
                    计算范围，一般为：
                    end - start = 时间，单位可六种（年、月、日、时、分、秒）
         */
        "duration": impactDuration,
        /*
                    "optionJsx.depend.impact": {
                        "evaluate": {
                            "input": {
                                "value": "VALUE"
                            },
                            "range": {
                                "[0,60)": "bad",
                                "[60,75)": "common",
                                "[75,90)": "better",
                                "[90,100]": "best"
                            },
                            "target": "assessValue"
                        }
                    },
                    根据数学值范围得到值
                    1. value在 [min,max] 中表示包含 min 和 max 的区间
                    2. value在 (min,max) 中表示不包含 min 和 max 的区间
                    两种符号可随意组合
         */
        "evaluate": impactRange,

        "multiply": impactMultiply,
    }
}
