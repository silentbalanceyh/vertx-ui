import __Zn from './zero.module.dependency';
import __COND from './verify.__.fn.is.condition';

const __asyncPre = (reference, jsx, rule, value) => {
    // 有值才验证
    const parameters = __Zn.parseAjax(rule.config.params, reference);
    // 基本条件
    const {alias} = rule.config;
    const field = alias && alias.field ? alias.field : rule.field;

    // 让级别条件支持别名，重新抽取字段
    if (
        jsx.hasOwnProperty("precision") ||
        jsx.hasOwnProperty('min') ||
        jsx.hasOwnProperty('max')
    ) {
        if (jsx.precision) {
            parameters[field] = parseFloat(value);
        } else {
            parameters[field] = parseInt(value, 10);
        }
    } else {
        if (__Zn.isFunction(jsx.normalize)) {
            parameters[field] = jsx.normalize(value);
        } else {
            parameters[field] = value;
        }
    }
    return parameters;
}
const __asyncCallback = (parameters = {}, rule = {}) => {
    // existing 时，参数间关系默认为 AND（更新专用）
    if (Object.keys(parameters).length > 1) {
        const andKey = "";
        parameters[andKey] = true;
    }
    // 远程调用
    return __Zn.asyncTrue(rule.config, parameters, {
        // 存在即返回message
        success: () => Promise.reject(rule.message),    // ?allback(rule.message),
        failure: () => Promise.resolve()                // ?allback()
    });
}

const existing = (reference = {}, jsx = {}) => (rule = {}, value) => {
    __Zn.fxTerminal(!rule.config, 10022, rule.config);
    if (rule.config) {
        if (value) {
            try {
                // 有值才验证
                const parameters = __asyncPre(reference, jsx, rule, value);

                /*
                 * 关于 key 的计算
                 * 1）$inited 为初始 key
                 * 2）form 中还会包含最新的 key（如果这个过程中会出现变更）
                 */
                {
                    const {$inited} = reference.props;
                    const {alias} = rule.config;
                    const hitField = alias && alias.key ? alias.key : "key";

                    let hitValue = $inited ? $inited[hitField] : undefined;

                    /*
                     * 追加流程，如果 form 的某些操作更改了当前 form 中存在的 key，则需要
                     * 将 hitValue 重新设值成新的 key 而不是旧的
                     */
                    const changed = __Zn.formGet(reference, null);
                    if (!!changed[hitField] && hitValue !== changed[hitField]) {
                        hitValue = changed[hitField];
                    }

                    if (hitValue) {
                        // 更新Mode
                        const updateKey = `key,<>`;
                        parameters[updateKey] = hitValue;
                    }
                }
                return __asyncCallback(parameters, rule);
            } catch (error) {
                console.error(error);
                return Promise.reject(error.message);
            }
        } else {
            return Promise.resolve();
            // ?allback();
        }
    }
};
const uri = (reference = {}, jsx = {}) => (rule = {}, value) => {
    __Zn.fxTerminal(!rule.config, 10022, rule.config);
    if (rule.config) {
        if (value) {
            try {
                // 有值才验证
                const parameters = __asyncPre(reference, jsx, rule, value);

                return __asyncCallback(parameters, rule);
            } catch (error) {
                console.error(error);
                return Promise.reject(error.message);
            }
        } else {
            return Promise.resolve();
            // ?allback();
        }
    }
};
const filename = (reference = {}, jsx = {}) => (rule = {}, value) => {
    if (value) {
        // 有值验证
        if (!__Zn.isFileName(value)) {
            return Promise.reject(rule.message);
            // ?allback();
        } else {
            // const {message} = rule;
            // ?allback(message);
        }
    } else {
        // ?allback();
    }
    return Promise.resolve();
}


const duplicatedDatum = (reference = {}) => (rule = {}, value) => {
    if (__COND.isReady(rule, reference, value)) {
        const {config = {}, field} = rule;
        const {datum = "", keyField = "key", filter = {}} = config;
        if (datum) {
            /*
             * 从当前表单中读取数据
             */
            const source = __Zn.onDatum(reference, datum);
            const key = __Zn.formGet(reference, keyField);
            /*
             * duplicated检查
             * 1. 当前字段已存在
             * 2. 主键必须不同
             */
            const parsed = __Zn.parseInput(filter, reference);
            const counter = source
                .filter(item => (key !== item[keyField] && value === item[field]))
                .filter(item => __Zn.isSubset(parsed, item))
                .length;
            if (0 < counter) {
                return Promise.reject(rule.message);
                // ?allback(rule.message);
            } else {
                // ?allback();
            }
        } else {
            // ?allback();
        }
    } else {
        // ?allback();
    }
    return Promise.resolve();
};
/*
 * 异步验证执行大规模改动，主要是返回值进行了调整
 * 原来的写法：
 * - 正确：callback()
 * - 错误：callback(message)
 *
 * 新的写法：
 * - 正确：Promise.resolve()
 * - 错误：Promise.reject(message)
 */
export default {
    /*
     * 返回为 true 的时候，是提示验证信息
     * 返回为 false 的时候，是验证通过
     */
    existing,
    uri,
    filename,
    /*
     * 特殊规则
     */
    duplicatedDatum,
}