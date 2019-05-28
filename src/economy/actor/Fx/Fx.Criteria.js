import Ux from "ux";
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
const _inNorm = (reference, field) => {
    const {$table: {columns = []}} = reference.state;
    const types = columns.filter(column => column.hasOwnProperty("$filter"))
        .filter(column => field === column.dataIndex)
        .map(column => column['$filter'])
        .map(filter => filter.type);
    let normalized = {};
    if (0 < types.length) {
        // 列过滤中存在
        const type = types[0];
        if ("SEARCH" === type) {
            normalized.field = `${field},c`;
            normalized.type = Symbol.for("INNER-SEARCH");
            normalized.isArray = false;
        } else {
            normalized.field = `${field},i`;
            normalized.type = Symbol.for("INNER-DIRECT");
            normalized.isArray = true;
        }
    } else {
        // 不存在于列过滤中
        if (0 < field.indexOf(',')) {
            // 本身已经带了操作符号
            normalized.field = field;
        } else {
            // 本身不带操作符号
            normalized.field = `${field},c`;
        }
        normalized.isArray = false;
        normalized.type = Symbol.for("OUTER");
    }
    return normalized;
};
const _inNormValue = (term = {}, value) => {
    if (Symbol.for("OUTER") === term.type) {
        // 外置过滤，直接追加
        term.value = value;
    } else {
        // 列过滤，value 必须是 [] 格式
        if (U.isArray(value)) {
            // 删除 / 保存
            if (0 === value.length) {
                // in的特殊处理，就是不选择的时候直接删除该条件
                term.value = "__DELETE__";
            } else {
                if (Symbol.for("INNER-SEARCH") === term.type) {
                    // 进行值格式化
                    term.value = value[0];
                } else {
                    term.value = value;
                }
            }
        }
    }
};
const update = (reference, $condition = {}) => {
    // 原始的查询条件，一旦执行就会存入
    const normalized = {};
    Ux.itObject($condition, (field, value) => {
        // 单个条件的处理
        const term = _inNorm(reference, field);
        // 针对条件设值
        _inNormValue(term, value);
        // 条件处理
        normalized[term.field] = term.value;
    });
    return {
        normalized,
    };
};
export default {
    update
};