import Ele from '../../element';
import On from './O.on';

export default {
    /**
     * ## 特殊函数「Zero」
     *
     * 带辅助数据的强化版`elementFind`方法。
     *
     * @memberOf module:_element
     * @param {ReactComponent} reference React对应组件引用。
     * @param {String} source 需要读取的 Tabular/Assist 的键值。
     * @param {Object} filters 查询条件。
     * @return {Array} 返回查找的数组。
     */
    elementFindDatum: (reference, source, filters) =>
        Ele.elementFind(On.onDatum(reference, source), filters),
    /**
     * ## 特殊函数「Zero」
     *
     * 带辅助数据的强化版`elementUnique`方法。
     *
     * @memberOf module:_element
     * @param {ReactComponent} reference React对应组件引用。
     * @param {String} source 需要读取的 Tabular/Assist 的键值。
     * @param {String} field 查询专用字段。
     * @param {any} value 查询字段对应的值。
     * @return {Object|null} 返回查找到的唯一记录数据。
     */
    elementUniqueDatum: (reference, source, field, value) =>
        Ele.elementUnique(On.onDatum(reference, source), field, value),
    /**
     * ## 特殊函数「Zero」
     *
     * 带辅助数据的强化班`elementGroup`方法。
     *
     * @memberOf module:_element
     * @param {ReactComponent} reference React对应组件引用。
     * @param {String} source 需要读取的 Tabular/Assist 的键值。
     * @param {String} field 分组专用的字段名。
     * @return {Object} 分组过后的数据。
     */
    elementGroupDatum: (reference, source, field) =>
        Ele.elementGroup(On.onDatum(reference, source), field)
}