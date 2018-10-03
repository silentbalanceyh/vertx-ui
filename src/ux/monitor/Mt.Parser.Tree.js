import QElement from "./Mt.Parser.Element";
import Ux from 'ux';

const datumTree = (object = {}) => {
    const vector = {};
    vector.name = "[Object] Root";
    vector.color = "#666";
    const counter = [true];
    vector.children = QElement.toChildren(object, counter);
    return {
        items: vector,
        layout: {
            height: counter.length * 40,
            hgap: 100,
            vgap: 10
        }
    };
};
const datumMatrix = (array = []) => {
    // 两份数据处理
    const data = Ux.clone(array);
    // 计算Table
    const table = {};
    table.pagination = false;
    table.columns = [];
    // 计算Array中最多的Object
    if (0 < array.length) {
        const keys = array[0] ? Object.keys(array[0]) : [];
        keys.forEach(key => {
            const item = {};
            item.dataIndex = key;
            item.title = key;
            table.columns.push(item);
        });
    }
    return {data, table};
};
export default {
    datumTree,
    datumMatrix
};