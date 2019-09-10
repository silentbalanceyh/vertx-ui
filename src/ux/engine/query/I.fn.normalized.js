import Ux from 'ux';
import U from 'underscore';
/*
 * 过滤来源的操作点有几个：
 * 1. 列过滤修改 $condition
 *    - SEARCH：搜索框
 *    - DIRECT：下拉筛选
 *    - 这种不反向修改 搜索框 和 高级搜索框
 * 2. 基础搜索修改 $condition
 *    - 若存在于列过滤中，则需要同步设值
 *    - 若存在于表单中（高级），则需要同步设值
 * 3. 高级搜索修改 $condition
 *    - 若存在于列过滤中，则需要同步设值
 *    - 若存在于基础搜索中，则需要同步设值
 */
const _inNorm = (field, filterType = {}) => {
    let normalized = {};
    if (filterType.hasOwnProperty(field)) {
        const config = filterType[field];
        const type = config.type;
        if ("SEARCH" === type) {
            normalized.field = `${field},c`;
            normalized.type = Symbol.for("INNER-SEARCH");
            normalized.isArray = false;
        } else {
            normalized.field = `${field},i`;
            normalized.type = Symbol.for("INNER-DIRECT");
            normalized.isArray = true;
        }
        /*
         * STRING
         * BOOLEAN
         * NUMBER
         */
        normalized.dataType = config.dataType;
    } else {
        // 条件不存在于列过滤中
        if (0 < field.indexOf(',')) {
            // 本身带有操作符
            normalized.field = field;
        } else {
            // 本身不带操作符，默认使用 Contains 条件
            normalized.field = `${field},c`;
        }
        normalized.isArray = false;
        normalized.type = Symbol.for("OUTER");  // 外层组件传入
    }
    return normalized;
};
/*
 * __NONE__：什么也不做
 * STRING：维持原样：Ant Design中本身就是如此
 * BOOLEAN 和 NUMBER：需要转换
 */
const _inActualValue = (term = {}, value = []) => {
    const dataType = term.dataType;
    if ("BOOLEAN" === dataType) {
        return Ux.clone(value).map(item => {
            if ("false" === item) {
                return false;
            } else {
                return Boolean(item);
            }
        });
    } else if ("NUMBER" === dataType) {
        return Ux.clone(value).map(item => Number(item));
    } else {
        return value;
    }
};
/*
 * 必须按顺序执行，term 的结构很重要
 */
const _inNormValue = (term = {}, value) => {
    if (Symbol.for("OUTER") === term.type) {
        // 外置过滤，直接追加即可
        term.value = value;
    } else {
        /*
         * 列过滤模式，value 必须是 [] 格式
         * 和 Ant Design 中的列过滤对应的值相关
         */
        if (U.isArray(value)) {
            // 删除 / 保存
            if (0 === value.length) {
                // in的特殊处理，不选择的时候直接删除该条件
                term.value = "__DELETE__";
            } else {
                if (Symbol.for("INNER-SEARCH") === term.type) {
                    /*
                     * 必定是 STRING，直接进行值格式化
                     */
                    term.value = value[0];
                } else {
                    term.value = _inActualValue(term, value);
                }
            }
        }
    }
};
export default (condition = {}, {
    filterType = {}, // 列过滤专用配置，对应到 $terms 变量中
}) => {
    // 原始查询条件，一旦执行就会存入
    const normalized = {};
    Ux.itObject(condition, (field, value) => {
        // 条件字段处理
        const term = _inNorm(field, filterType);
        // 针对处理后的最终值
        _inNormValue(term, value);
        // 条件处理
        normalized[term.field] = term.value;
    });
    if (1 < Object.keys(normalized).length) {
        normalized[""] = true;
    }
    return normalized;
};