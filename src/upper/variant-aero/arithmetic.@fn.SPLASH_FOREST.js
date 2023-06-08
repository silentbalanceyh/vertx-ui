import Ux from "ux";

export default (data = {}, config = {}) => {
    /*
     * 根据 data 和 config 处理配置信息
     */
    const {selected = []} = data;
    const {tree = {}, selection = {}, tpl} = config;
    /*
     * 根据 config 中的 tree 中数据构造 tree，然后拉平
     * 拉平过后的数据才会有 _level 字段
     */
    const treeData = Ux.toTree(selected, tree);
    const flatArray = Ux.elementFlat(treeData);

    const tplValues = {};
    Object.keys(selection).forEach(selectedField => {
        const fieldConfig = selection[selectedField];
        if (fieldConfig) {
            const {condition = {}, field} = fieldConfig;
            const found = Ux.elementFind(flatArray, condition);
            if (0 < found.length) {
                tplValues[selectedField] = found
                    .map(item => item[field])
                    .filter(value => !!value);
            }
        }
    });
    /*
     * 计算最终的 criteria
     */
    const criteria = {};
    Object.keys(tpl).forEach(field => {
        const targetField = tpl[field];
        if (targetField) {
            const value = tplValues[targetField];
            if (value) {
                if (Ux.isArray(value)) {
                    if (1 === value.length) {
                        criteria[field] = value[0];
                    } else {
                        criteria[`${field},i`] = value;
                    }
                } else {
                    criteria[field] = value;
                }
            }
        }
    });
    criteria[""] = true;        // 由于是做限制，所以只提供 AND 限制
    return JSON.stringify(criteria);
}