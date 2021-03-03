import M from './O.mapping';
import Ux from 'ux';

const inDataSource = (reference, data = {}) => {
    // 数据源初始化
    const $selected = Ux.input(data, M.DataSource);
    // $selected.instance = ;                   // 数据库名？
    // 数据源中的物理表格式化
    $selected.children = [];
    if (data.children && 0 < data.children.length) {
        data.children.forEach(each => {
            const child = {};
            child.key = each.id;                // 物理表主键
            child.name = each.name;             // 物理表名
            child.code = each.code;             // 物理表编码
            $selected.children.push(child);
        })
    }
    return $selected;
}
const outDataSource = (data = {}) => {
    const submitted = Ux.output(data, M.DataSource);
    submitted.type = submitted.sourceType;      // 数据源类型
    const user = Ux.isLogged();                 // 读取 tenant Id
    submitted.tenantId = user.company;          // 租户ID（用户对应的ID）
    return submitted;
}
const outDataTable = (data = {}) => {
    const submitted = Ux.output(data, M.DataTable);
    const user = Ux.isLogged();                 // 读取 tenant Id
    submitted.tenantId = user.company;          // 租户ID（用户对应的ID）
    return submitted;
}
const inDataTable = (reference, data = {}) => {
    // 数据源初始化
    const $selected = Ux.input(data, M.DataTable);
    // 物理表字段信息
    return $selected;
}
const outSyncTable = (data = {}) => {
    const submitted = {};
    const user = Ux.isLogged();                 // 读取 tenant Id
    submitted.tenantId = user.company;          // 租户ID（用户对应的ID）
    submitted.dataSourceId = data.dataSourceId;

    const dataSourceTables = [];
    const table = {"TBL_NAME": data['tableCode']}; //用 code 连接外部和内部数据模型
    dataSourceTables.push(table);
    submitted.dataSourceTables = dataSourceTables;
    return submitted;
}

export default {
    inDataSource,
    outDataSource,
    inDataTable,
    outDataTable,
    outSyncTable,
}