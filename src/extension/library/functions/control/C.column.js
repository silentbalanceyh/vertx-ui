import Ux from 'ux';

/**
 * ## 扩展函数
 *
 * 表格列扩展配置。
 *
 * @memberOf module:_config
 * @param {Array} original 原始列配置
 * @param {Object} config 表格专用输入配置
 * @returns {Array} 返回处理过后的列配置
 */
const configColumn = (original = [], config = {}) => {
    const {columns = [], projections = []} = config;
    /*
     * 合并过后的列存储在当前 $table 变量中
     * Full模式不改变，只做一次初始化
     */
    const normalized = Ux.clone(original).concat(columns);
    const resultColumns = [];
    {
        normalized
            .map(column => Ux.valueLadder(column))
            /*
             * 按照 $projections 计算，包含了的放到 MyColumns 中
             */
            .filter(column => {
                if (0 === projections.length) {
                    // 为 0 不过滤
                    return true;
                } else {
                    // 不为 0 的时候过滤
                    const $projections = Ux.immutable(projections);
                    return $projections.contains(column.dataIndex)
                }
            })
            .forEach(column => resultColumns.push(column));
    }
    return resultColumns;
};
export default {
    configColumn
}