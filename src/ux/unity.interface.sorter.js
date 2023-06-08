import __Zn from 'zone';

export default {
    /**
     *
     * ## 「标准」`Ux.sorterObject`
     *
     * 针对对象按照`key`的字典序进行排序，主要用于打印过程中生成更容易分析的日志专用。
     *
     * @memberOf module:sorter/zone
     * @param {Object} input 传入的对象Object的值。
     * @return {Object} 排序过后的对象。
     */
    sorterObject: (input) => __Zn.sorterObject(input),
    /**
     * ## 「标准」`Ux.sorterAsc`
     *
     * 按字符串顺序排序。
     *
     * ```js
     * Object.keys(groupedData).sort(Ux.sorterAsc).forEach(identifier => {
     *      // 排序后的执行
     * });
     * ```
     *
     * @memberOf module:sorter/zone
     * @param {Object|any} left 左值。
     * @param {Object|any} right 右值。
     * @param {String} key 键值。
     * @return {number} 排序因子
     */
    sorterAsc: (left, right, key) => __Zn.sorterAsc(left, right, key),
    /**
     * ## 「标准」`Ux.sorterAscFn`
     *
     * 「2阶」按字符串顺序排序，生成函数。
     *
     * @memberOf module:sorter/zone
     * @param {String} key 生成函数需要比较的字段`key`的值。
     * @return {function(*=, *=): number} 排序函数。
     */
    sorterAscFn: (key) => (left, right) => __Zn.sorterAsc(left, right, key),
    /**
     * ## 「标准」`Ux.sorterAscT`
     *
     * 按任意类型顺序排序。
     *
     * @memberOf module:sorter/zone
     * @param {any} left 左值。
     * @param {any} right 右值。
     * @param {String} key 键值。
     * @return {number} 排序因子
     */
    sorterAscT: (left, right, key) => __Zn.sorterAscT(left, right, key),

    /**
     * ## 「标准」`Ux.sorterAscTFn`
     *
     * 「2阶」按任意类型顺序排序，生成函数。
     *
     * @memberOf module:sorter/zone
     * @param {String} key 生成函数需要比较的字段`key`的值。
     * @return {function(*=, *=): number} 排序函数。
     */
    sorterAscTFn: (key) => (left, right) => __Zn.sorterAscT(left, right, key),
    /**
     * ## 「标准」`Ux.sorterAscD`
     *
     * 按时间类型顺序排序。
     *
     * @memberOf module:sorter/zone
     * @param {any} left 左值。
     * @param {any} right 右值。
     * @param {String} key 键值。
     * @return {number} 排序因子
     */
    sorterAscD: (left, right, key) => __Zn.sorterAscD(left, right, key),
    /**
     * ## 「标准」`Ux.sorterAscDFn`
     *
     * 「2阶」按时间类型顺序排序，生成函数。
     *
     * @memberOf module:sorter/zone
     * @param {String} key 生成函数需要比较的字段`key`的值。
     * @return {function(*=, *=): number} 排序函数。
     */
    sorterAscDFn: (key) => (left, right) => __Zn.sorterAscD(left, right, key),
    /**
     * ## 「标准」`Ux.sorterDesc`
     *
     * 按字符串逆序排序。
     *
     * @memberOf module:sorter/zone
     * @param {Object|any} left 左值。
     * @param {Object|any} right 右值。
     * @param {String} key 键值。
     * @return {number} 排序因子
     */
    sorterDesc: (left, right, key) => __Zn.sorterDesc(left, right, key),
    /**
     * ## 「标准」`Ux.sorterDescFn`
     *
     * 「2阶」按字符串逆序排序，生成函数。
     *
     * @memberOf module:sorter/zone
     * @param {String} key 生成函数需要比较的字段`key`的值。
     * @return {function(*=, *=): number} 排序函数。
     */
    sorterDescFn: (key) => (left, right) => __Zn.sorterDesc(left, right, key),
    /**
     * ## 「标准」`Ux.sorterDescT`
     *
     * 按任意类型逆序排序。
     *
     * @memberOf module:sorter/zone
     * @param {any} left 左值。
     * @param {any} right 右值。
     * @param {String} key 键值。
     * @return {number} 排序因子
     */
    sorterDescT: (left, right, key) => __Zn.sorterDescT(left, right, key),
    /**
     * ## 「标准」`Ux.sorterDescTFn`
     *
     * 「2阶」按任意类型逆序排序，生成函数。
     *
     * @memberOf module:sorter/zone
     * @param {String} key 生成函数需要比较的字段`key`的值。
     * @return {function(*=, *=): number} 排序函数。
     */
    sorterDescTFn: (key) => (left, right) => __Zn.sorterDescT(left, right, key),
    /**
     * ## 「标准」`Ux.sorterDescD`
     *
     * 按时间类型逆序排序。
     *
     * @memberOf module:sorter/zone
     * @param {any} left 左值。
     * @param {any} right 右值。
     * @param {String} key 键值。
     * @return {number} 排序因子
     */
    sorterDescD: (left, right, key) => __Zn.sorterDescD(left, right, key),
    /**
     * ##「标准」`Ux.sorterDescDFn`
     *
     * 「2阶」按时间类型逆序排序，生成函数。
     *
     * @memberOf module:sorter/zone
     * @param {String} key 生成函数需要比较的字段`key`的值。
     * @return {function(*=, *=): number} 排序函数。
     */
    sorterDescDFn: (key) => (left, right) => __Zn.sorterDescD(left, right, key)
};
