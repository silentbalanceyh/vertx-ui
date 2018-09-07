import DataSet from '@antv/data-set';

const _buildDs = (dataSource = [], fields = []) => {
    const ds = new DataSet();
    const data = ds.createView().source(dataSource);
    data.transform({
        type: "fold",
        fields,
        key: "key",
        value: "value"
    });
    return data;
};
const dsBar = (dataSource = [], resource = {}) => {
    const keys = Object.keys(resource.group);
    const dataArr = [];
    const fields = [];
    keys.forEach(key => {
        const dataItem = {};
        dataItem.group = resource.group[key];
        dataSource.forEach(each => {
            const dimKey = each[resource.dim];
            fields.push(dimKey);
            dataItem[dimKey] = each[key];
        });
        dataArr.push(dataItem);
    });
    const data = _buildDs(dataArr, fields);
    const config = {};
    config.color = "group";
    config.position = "key*value";
    return {data, config}
};

const dsRadial = (dataSource = [], resource = {}) => {
    const keys = Object.keys(resource.group);
    const dataArr = [];
    const fields = [];
    dataSource.forEach(item => {
        const dataItem = {};
        if (item.hasOwnProperty(resource.item)) {
            dataItem[resource.item] = item[resource.item];
            keys.forEach(key => {
                if (item.hasOwnProperty(key)) {
                    const targetKey = resource.group[key];
                    dataItem[targetKey] = item[key];
                    fields.push(targetKey);
                }
            })
        }
        dataArr.push(dataItem);
    });
    const data = _buildDs(dataArr, fields);
    const config = {};
    config.position = `${resource.item}*value`;
    config.color = 'key';
    return {data, config}
};
export default {
    dsBar,
    dsRadial
}