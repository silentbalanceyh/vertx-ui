import Ux from "ux";
import Init from './Op.Init';

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
const _appendLevel = (data = [], level = 1) => {
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
            const flattedObjects = _appendLevel(children, (level + 1));
            flattedObjects.forEach(flattedItem => {
                const $item = Ux.clone(item);
                flatObjects.push(Object.assign($item, flattedItem));
            })
        }
    });
    return flatObjects;
};
const initRow = (reference) => {
    const options = Init.readOptions(reference);
    const {table} = reference.state;
    const data: any = {};
    data.key = Ux.randomUUID();
    if (table && 0 < table.columns.length) {
        if (options["table.edit.standalone"]) {
            // TODO:
            // 独立模式，每一个level中的处理独立核算，且不计算maxLevel

        } else {
            // TODO:
            // 依赖模式，后一个level要求前一个level必须有数据
        }
    }
    return data;
};
const initData = (reference: any, data: any = []) => {
    // 计算Level
    data.forEach(item => _setCounter(item, 1));
    // 追加counter
    const flatted = _appendLevel(data);
    // 每一行追加一个key防止rowKey问题
    flatted.forEach(each => each.key = Ux.randomUUID());
    // 编辑模式才会在空数据中增加
    const options = Init.readOptions(reference);
    if (options["table.edit.enabled"]) {
        if (0 === flatted.length) {
            // 最少有一行的前提就是table.empty.init = true
            if (options['table.empty.init']) {
                flatted.push(initRow(reference));
            }
        }
    }
    // 针对flatted的内容执行拉平处理
    return flatted;
};
export default {
    initData
}