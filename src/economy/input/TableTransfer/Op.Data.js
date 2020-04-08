import Ux from 'ux';
import {Dsl} from "entity";

const _getSelectedFilter = (reference, revert = false) => {
    const {selected = []} = reference.state;
    // 被选择
    let keys = selected.map(item => item.key);
    keys = Ux.immutable(keys);
    return item => revert ? !keys.contains(item.key) :
        keys.contains(item.key);
};
const _isFlat = (reference, key) => {
    if (key) {
        const {config = {}} = reference.props;
        const {flat = {}} = config;
        if (flat[key]) {
            return flat[key];
        } else {
            // 不配置 key 则不使用平行模式
            return false;
        }
    } else {
        // 不配置 key 则不使用平行模式
        return false;
    }
};

const getFrom = (reference, config = {}) => {
    const {_data = [], shared = []} = reference.state;
    const standard = Ux.clone(_data).filter(_getSelectedFilter(reference));
    const dataArray = Dsl.getArray(standard);
    shared.forEach(each => dataArray.saveElement(each));
    let data = dataArray.to();
    const flatField = _isFlat(reference, 'to');
    if (flatField) {
        // 直接过滤
        data = data.filter(item => item[flatField]);
    } else {
        data = Ux.valueTree(data, {
            ...config.tree,
            zero: false
        });
    }
    // 补充每个分支的数据
    return data;
};
const getTo = (reference, config = {}) => {
    const {_data = [], filters = {}} = reference.state;
    let data = _data.filter(_getSelectedFilter(reference, true));
    // 过滤信息
    Ux.valueValid(filters);
    if (0 < Object.keys(filters).length) {
        const query = {criteria: filters};
        data = Ux.aiSearcher(data).query(query);
        // 补齐带有parentId的数据
        const formated = Dsl.getArray(data);
        const treeData = config.tree;
        data.forEach(item => {
            const recordArray = Ux.elementBranch(_data, item[treeData.key],
                treeData.field, treeData.key);
            recordArray.forEach(each => formated.saveElement(each));
        });
        data = formated.to();
    }
    const flatField = _isFlat(reference, 'from');
    if (flatField) {
        data = data.filter(item => item[flatField]);
    } else {
        data = Ux.valueTree(data, {
            ...config.tree,
            zero: false
        });
    }
    return data;
};
export default {
    getFrom,
    getTo
};