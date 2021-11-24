import Dft from './I.default';

/**
 * 验证规则属性
 * message：校验文件
 * type: 可选（内建类型）
 * required：是否必填
 * len:字段长度
 * min:最小长度
 * max:最大长度
 * enum: 枚举类型
 * pattern:正则表达式校验
 * transform:校验前转换字段值
 * validator: 自定义校验
 * @method _uiDisplay
 * @private
 * @param raft 构造的配置
 * @param config 额外的配置
 * **/
const raftRow = (raft = {}, config = {}) => {
    const {row = {}, index = 0, calculated = {}} = config;
    const {entity, rowConfig = {}, rowClass = {}} = calculated;
    const rowItem = {};
    /*
     * rowItem 计算
     */
    rowItem.key = entity ? `form-row-${entity}-${index}` : `form-row-${index}`;
    rowItem.className = rowClass[index] ? rowClass[index] : "";
    /*
     * rowStyle 核心计算
     */
    const rowStyle = rowConfig[index];
    const options = raft.options;
    const style = Dft.applyRow(row, rowStyle, options);
    /*
     * 修正 rowHeight 用于处理高度问题
     */
    if (!style.hasOwnProperty('height') && options.hasOwnProperty('rowHeight')) {
        style.minHeight = options.rowHeight;
    }
    rowItem.style = style;
    /*
     * 设置 rowStyle
     */
    return {rowItem, rowStyle};
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    raftRow
}