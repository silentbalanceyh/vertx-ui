import Ux from 'ux';
import U from 'underscore';

const _getRecord = (fromData = {}, child = {}) => {
    const item = {};
    Ux.itObject(child, (to, from) => item[to] = fromData[from]);
    return item;
};

const getOptions = (reference) => {
    let {source = [], config: {child = {}}} = reference.props;
    source = Ux.clone(source);  // 拷贝数据
    // 合并child生成子项标题
    if (!child.key) child.key = "key";
    if (!child.value) child.value = "key";
    if (!child.label) child.label = "label";
    source.forEach(item => {
        if (U.isArray(item.children)) {
            // 有children时才处理
            const normalized = [];
            item.children.forEach(childData => {
                const item = _getRecord(childData, child);
                normalized.push(item);
            });
            item.children = normalized;
        }
    });
    return source;
};
const on2Change = (reference) => (keys) => {
    const previous = reference.state.data;
    const data = {};
    keys.forEach(key => {
        if (previous.hasOwnProperty(key)) {
            data[key] = previous[key];
        } else {
            data[key] = [];
        }
    });
    reference.setState({data});
    Ux.xtChange(reference, data, true);
};
const on2ChildChange = (reference, parentKey = "") => (event) => {
    const previous = reference.state.data;
    if (previous && previous.hasOwnProperty(parentKey)) {
        const data = Ux.clone(previous);
        data[parentKey] = event;
        reference.setState({data});
        Ux.xtChange(reference, data, true);
    }
};
export default {
    getOptions,
    on2Change,
    on2ChildChange
};