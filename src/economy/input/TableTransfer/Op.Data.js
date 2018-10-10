import Ux from 'ux';
import {DataLabor} from "entity";

const _getSelectedFilter = (reference, revert = false) => {
    const {selected = []} = reference.state;
    // 被选择
    let keys = selected.map(item => item.key);
    keys = Ux.immutable(keys);
    return item => revert ? !keys.contains(item.key) :
        keys.contains(item.key);
};

const getFrom = (reference, config = {}) => {
    const {_data = [], shared = [], filters = {}} = reference.state;
    const standard = Ux.clone(_data).filter(_getSelectedFilter(reference));
    const dataArray = DataLabor.getArray(standard);
    shared.forEach(each => dataArray.saveElement(each));
    let data = dataArray.to();
    data = Ux.valueTree(data, {
        ...config.tree,
        zero: false,
        filters
    });
    return data;
};
const getTo = (reference, config = {}) => {
    const {_data = []} = reference.state;
    let data = Ux.clone(_data).filter(_getSelectedFilter(reference, true));
    data = Ux.valueTree(data, {
        ...config.tree,
        zero: false
    });
    return data;
};
export default {
    getFrom,
    getTo
};