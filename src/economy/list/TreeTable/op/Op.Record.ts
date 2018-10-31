import Ux from 'ux';
import Init from './Op.Init';

const _getValue = (record: any = {}, level: Number, field: String) => {
    const finalField = `${level}.${field}`;
    return record[finalField];
};
const _getDataVertical = (source: any = {}, level: Number, field: any, rootId: any) => {
    let filtered = Ux.clone(source);
    if (rootId) {
        const filterKey = `${level}.parentId`;
        filtered = filtered.filter(item => item[filterKey] === rootId);
    }
    // 先根据rootId执行过滤
    const fieldKey = `${level}.${field}`;
    const hashKey: any = {};
    const dataArray: any = [];
    filtered.forEach(row => {
        const key = row[`${level}.key`];
        // 保证只添加一次
        if (!hashKey.hasOwnProperty(key)) {
            if (row[fieldKey]) dataArray.push(row[fieldKey]);
            hashKey[key] = true;
        }
    });
    return dataArray;
};
const _getDataTree = (source: any = [], meta: any = {}, record: any) => {
    const data: any = {};
    // 先计算当前单元格对应的值
    const _key = `${meta.level}.key`;
    data.key = record[_key];
    // 再计算当前单元格对应的字段
    const _field = `${meta.level}.${meta.field}`;
    // 某一个字段的双树相关数据
    const dataRecord: any = {};
    dataRecord.current = record[_field];
    // 计算父层字段
    const pid = record[`${meta.level}.parentId`];
    if (pid) {
        // 非根节点
        const ppid = record[`${meta.level - 1}.parentId`];
        dataRecord.up = _getDataVertical(source, meta.level - 1, meta.field, ppid);
    } else {
        // 已经是根了
        dataRecord.up = null;
    }
    // 计算本层字段
    dataRecord.current = _getDataVertical(source, meta.level, meta.field, pid);
    // 计算子层字段
    const id = record[`${meta.level}.key`];
    dataRecord.down = _getDataVertical(source, meta.level + 1, meta.field, id);
    data.data = dataRecord;
    return data;
};
const _getDataValue = (reference: any, column: any = {}, record: any) => {
    const options = Init.readOptions(reference);
    const _addon: any = {};
    _addon.level = column.level;
    if (options.hasOwnProperty("extra.data.keys")) {
        const {current} = reference.state;
        if (0 < current.length) {
            Ux.arrayConnect(options['extra.data.keys'], (item) => ({
                field: item,    // 命中字段
                level: column.level,    // 当前所处的层级
            })).forEach(meta => _addon[meta.field] = _getDataTree(current, meta, record))
        }
    }
    return _addon;
};
const prepareRecord = (reference: any, column: any, record: any = {}) => {
    // 返回预定义数据
    const data: any = {};
    // 当前定义数据的行id
    if (record.key) data.key = record.key;
    data.level = column.level;
    if (!Ux.isEmpty(record)) {
        data.raw = Ux.clone(record);
    }
    // 处理_addon部分的数据
    {
        // 计算父节点数据
        const parentId = _getValue(record, column.level - 1, "key");
        if (parentId) data.parentId = parentId;
    }
    {
        // 计算配置节点数据
        const _addonData = _getDataValue(reference, column, record);
        if (!Ux.isEmpty(_addonData)) {
            Object.assign(data, _addonData);
        }
    }
    return data;
};

export default {
    prepareRecord,
}
