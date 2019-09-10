const raftItem = (item = {}, values = {}, config = {}) => {
    const {
        rowStyle = {},
        entity,
        spanAdjust,
    } = config;
    // 初始化optionConfig
    if (!item.optionConfig) {
        item.optionConfig = {};
    }
    // rowStyle 设置
    if (item.optionItem && rowStyle && 0 < Object.keys(rowStyle).length) {
        if (item.optionItem.style) {
            // 直接合并
            // eslint-disable-next-line
            for (const key in rowStyle) {
                if (rowStyle.hasOwnProperty(key)) {
                    item.optionItem.style[key] = rowStyle[key];
                }
            }
        } else {
            item.optionItem.style = rowStyle;
        }
    }
    // 动态 field（子表单）
    if (entity) {
        item.field = `children.${entity}.${item.field}`;
    }
    // spans 值的修正
    if (spanAdjust && !item.span) {
        item.span = spanAdjust;
    }
    // 初始值设置
    // raftValue(item, values);
};
export default {
    raftItem,
}