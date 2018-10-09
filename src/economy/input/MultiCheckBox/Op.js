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
const on2Change = (reference, item = {}) => (event) => {
    console.info("OnChange", event);

};
const on2ChildChange = (reference, item = {}) => (event) => {
    console.info("ChildChange");

};
export default {
    getOptions,
    on2Change,
    on2ChildChange
};