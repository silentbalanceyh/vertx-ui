import Ux from 'ux';
import Rdr from './UI.Render';

const _setCounter = (item: any = {}, level: any = 1) => {
    if (item.hasOwnProperty("children") && item.children) {
        let validArray = item.children.filter(each => !each.children ||
            0 === each.children.length);
        let continueArray = item.children.filter(each => each.children &&
            0 < each.children.length);
        let counter = validArray.length;
        if (0 < continueArray.length) {
            continueArray.forEach(continueItem => {
                _setCounter(continueItem, (level + 1));
                counter += continueItem._counter;
            });
        }
        validArray.forEach(validItem => _setCounter(validItem, (level + 1)));
        item._counter = counter;
    } else {
        item._counter = 0;
    }
    item._level = level;
};
const appendLevel = (data = [], level = 1) => {
    let flatObjects = [];
    data.forEach((dataItem: any = {}) => {
        const item: any = {};
        const {children, ...rest} = dataItem;
        Ux.itObject(rest, (field: any, value) => item[`${level}.${field}`] = value, true);
        // 最后处理children
        if (!children || 0 === children.length) {
            // 有记录信息
            flatObjects.push(item);
        }
        if (children && 0 < children.length) {
            const flattedObjects = appendLevel(children, (level + 1));
            flattedObjects.forEach(flattedItem => {
                const $item = Ux.clone(item);
                flatObjects.push(Object.assign($item, flattedItem));
            })
        }
    });
    return flatObjects;
};
const initData = (reference, table, data = []) => {
    data.forEach(item => _setCounter(item, 1));
    console.info(data);
    const flatted = appendLevel(data);
    // 解决行无Key的问题
    flatted.forEach(each => each.key = Ux.randomUUID());
    // 驱动最大的level
    const counterContainer = {};
    table.columns.forEach(column => {
        column.render = (text, record) => {
            const rowSpan = record[`${column.level}._counter`];
            const rowKey = record[`${column.level}.key`];
            const checkKey = `${column.dataIndex}-${rowKey}`;
            if (counterContainer[checkKey]) {
                return {
                    children: text,
                    props: {
                        rowSpan: 0
                    }
                }
            } else {
                counterContainer[checkKey] = true;
                return Rdr.renderOp(reference, record, {
                    text, rowSpan: 0 === rowSpan ? 1 : rowSpan, column
                })
            }
        }
    });
    if (0 === flatted.length) {
        // 保留一个空行
        flatted.push({key: Ux.randomUUID(), "1._counter": 1});
    }
    // 构造数据
    return {table, data: flatted}
};

export default {
    initData
}