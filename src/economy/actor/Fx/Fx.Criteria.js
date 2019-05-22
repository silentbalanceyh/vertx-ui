import Ux from "ux";
import U from "underscore";

const initFilterItem = (normalized = {}, field, value, table = {}) => {
    const {columns = []} = table;
    const types = columns.filter(column => column.hasOwnProperty("$filter"))
        .filter(column => field === column.dataIndex)
        .map(column => column['$filter'])
        .map(filter => filter.type);
    // 格式化条件
    let type = types[0];
    let targetField = field;
    if ("SEARCH" === type) {
        targetField = `${field},c`;
    } else {
        targetField = `${field},i`;
    }
    // 删除 / 保存
    if (0 === value.length) {
        // in的特殊处理，就是不选择的时候直接删除该条件
        normalized[targetField] = "__DELETE__";
    } else {
        if ("SEARCH" === type) {
            // 进行值格式化
            normalized[targetField] = value[0];
        } else {
            normalized[targetField] = value;
        }
    }
};
const update = (reference, filters) => {
    const {$table = {}} = reference.state ? reference.state : {};
    // 原始的查询条件，一旦执行就会存入
    const normalized = {};
    Ux.itObject(filters, (field, value) => {
        // 查询条件处理
        if (U.isArray(value)) {
            // 从状态中处理数据
            initFilterItem(normalized, field, value, $table);
        } else {
            normalized[field] = value;
        }
    });
    return {
        normalized,
    };
};
export default {
    update
};