import __Zo from 'zo';

/**
 * ## 「引擎」`Ux.valueFabric`
 *
 * 解析 fabric 专用事件配置处理器，该函数为后期函数，用于提取字段数据。
 *
 * 第二个参数通常为：
 *
 * ```js
 * // source,keyField,keyValue
 Ux.valueFabric(reference, `room.type,key,${roomTypeId}`, type => {
    const standardPrice = type.price;
    formValues.discount = Ux.mathDiscount(price, standardPrice);
 });
 * ```
 *
 * 第三参数为回调函数，会将读取到的数据直接传给回调函数来执行，这里执行的是唯一数据，上述示例中，读取的数据为：
 *
 * 1. source = room.type 的Assist数据源（一般是一个DataArray）。
 * 2. 使用key = 值筛选唯一记录。
 * 3. 将唯一记录传给 consumer 函数执行筛选过后的回调流程。
 *
 * @memberOf module:value/zodiac
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {Object} input 输入数据。
 * @param {Function} consumer 执行函数。
 */
const valueFabric = (reference, input = {}, consumer) =>
    __Zo.valueFabric(reference, input, consumer);
/**
 * ## 「引擎」`Ux.valueFabrics`
 *
 * （略）增强版的valueFabric函数，带过滤器的版本，可支持过滤操作。
 *
 * @memberOf module:value/zodiac
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {Object} input 输入数据。
 * @param {Function} consumer 执行函数。
 */
const valueFabrics = (reference, input = {}, consumer) =>
    __Zo.valueFabrics(reference, input, consumer);
/**
 * ## 「引擎」 `Ux.valueQr`
 *
 * ### 基本介绍
 *
 * 用于标准化 qr 语法的专用函数，其中标准化包括：
 *
 * - 直接移除 `__DELETE__` 部分的数据，去掉删除条件值
 * - 针对带有解析表达式的属性，执行 `parseValue` 配合 reference 执行数据源解析得到真实值
 *
 * 此方法可以在任何地方直接标准化查询条件，让查询条件配合最终值变得合法
 *
 * @memberOf module:value/zodiac
 * @param {Object} input 传入的没有处理的 Qr
 * @param {ReactComponent} reference React对应组件引用。
 * @return {Object} 返回最终结果
 */
const valueQr = (input = {}, reference) =>
    __Zo.valueQr(input, reference);
export default {
    valueQr,
    valueFabric,
    valueFabrics,
}