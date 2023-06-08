import __Zn from './zero.module.dependency';

const Cv = __Zn.Env;
const aiErrorFocus = (reference, item) => {
    if (item.field) {
        if (item.optionConfig && item.optionConfig.hasOwnProperty("rules")) {
            if (!item.optionJsx) item.optionJsx = {};
            // onFocus
            item.optionJsx.onFocus = __Zn.htmlErrorFocus(item);
            // onBlur
            item.optionJsx.onBlur = __Zn.htmlErrorBlur(item);
        }
    }
}
const aiValidation = (reference = {}, item = {}) => {
    if (item.optionConfig) {
        const rules = item.optionConfig.rules;
        // 触发条件设置，默认onBlur，符合大多数习惯
        if (!item.optionConfig.hasOwnProperty("validateTrigger")) {
            item.optionConfig.validateTrigger = "onBlur";
        }
        // 解析 rules ( For 4.0 )
        // item.optionItem.rules = aiValidator(reference, rules, item.optionJsx);
        // aiValidator -> valveValidator
        item.optionConfig.rules = __Zn.valveValidator(reference, rules, item.optionJsx);
    }
};

const aiNormalizer = (reference, item = {}) => {
    if (item.optionConfig && item.optionConfig.normalize) {
        const expr = item.optionConfig.normalize;
        if (expr) {
            const segments = expr.toString().split(",");
            if (1 <= segments.length) {
                // 读取类型
                const type = segments[0];
                const executor = Cv.V_NORMALIZER[type];
                if (executor) {
                    // 参数准备
                    const args = [];
                    for (let idx = 1; idx < segments.length; idx++) {
                        args.push(segments[idx]);
                    }
                    // 函数调用
                    const jFun = executor.apply(null, args);
                    if (jFun) {
                        item.optionConfig.normalize = jFun;
                    }
                } else {
                    console.error("[ Ux ] normalize 属性解析失败：", expr, item);
                }
            }
        }
    }
}

const aiRule = (rule, item) => {
    if (__Zn.isNotEmpty(rule)) {
        if (item.optionJsx && rule.hasOwnProperty(item.field)) {
            // 构造 config
            if (!item.optionJsx.config) {
                item.optionJsx.config = {}
            }
            // 合并 linker，追加 seeking
            const configRef = item.optionJsx.config;
            const ruleConfig = rule[item.field]
            if (ruleConfig.linker) {
                if (!configRef.linker) {
                    configRef.linker = {}
                }
                Object.assign(configRef.linker, ruleConfig.linker);
            }

            // 合并 seeking
            if (ruleConfig.seeking) {
                configRef.seeking = ruleConfig.seeking;
            }
            // TODO:
            // 合并 optionJsx.depend
            // 合并 optionJsx.impact
        }
    }
}
export default {
    aiErrorFocus,
    aiNormalizer,
    aiValidation,
    aiRule,
}