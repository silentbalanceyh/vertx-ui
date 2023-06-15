import __Zo from 'zo';

/**
 * ## 「标准」`Ux.writeDisabled`
 *
 * 在标准组件类型的依赖设置中，所有的禁用直接绑定 disabled 属性。
 *
 * @memberOf module:_ui
 * @param {Object} jsx 对应表单配置 optionJsx。
 * @param {Object|ReactComponent} reference React组件引用。
 */
// const writeDisabled = (reference, jsx = {}) =>
//     __Zo.writeDisabled(jsx, reference);
/**
 * ## 「标准」`Ux.writeReadOnly`
 *
 * 标准的 readOnly 的禁用设置，这种类型仅用于 Select 组件，因为 Select 组件不支持 readonly 属性，仅支持 disabled。
 *
 * @memberOf module:_ui
 * @param {Object} jsx 对应表单配置 optionJsx。
 * @param {Object|ReactComponent} reference React组件引用。
 */
// const writeReadOnly = (jsx = {}, reference) =>
//     __Zo.writeReadOnly(jsx, reference);
/**
 * ## 「标准」`Ux.writeImpact`
 *
 * 用于处理带依赖的数据相关联字段的影响信息，主要用于`联动下拉`组件，在 reset 触发时调用。
 *
 * 主要配置如：
 *
 * ```json
 * {
 *      "metadata": "type,测试类型,,,aiSelect",
 *      "optionJsx.config.datum": "source=ci.type,key=key,label=name",
 *      "optionJsx.depend.impact": {
 *          "reset": [
 *              "surety"
 *          ]
 *      }
 * }
 * ```
 *
 * 这里的配置会被当前方法解析，含义如：
 *
 * 1. 当前字段的值在发生改变时影响了其他表单字段。
 * 2. 影响过程中，如果表单发生了重设，那么会将目标字段调整成最早的状态。
 * 3. 不同类型的下拉值会出现不同的结果。
 *
 * @memberOf module:write/zodiac
 * @param {Object} formValues Form中初始的 linker 相关数据值。
 * @param {Object} configuration 反向依赖专用配置。
 * @param {any} value 输入的值。
 */
const writeImpact = (formValues = {}, configuration = {}, value) =>
    __Zo.writeImpact(formValues, configuration, value);
/**
 * ## 「标准」`Ux.writeLinker`
 *
 * 链接专用处理
 *
 * * optionJsx.config.linker
 * * optionJsx.config.linkerField
 * * optionJsx.config.linkerDate
 *
 *
 * （生成 form values）
 * 1. config的数据结构
 *      ```json
 *      {
 *          "linker": {
 *              "row1": "formField1",
 *              "row2": "formField2",
 *              "....": "其他字段"
 *          },
 *          "linkerField": "key",
 *          "linkerDate": {
 *              "field1": "format1"
 *          }
 *      }
 *      ```
 * 2. 参数说明
 *      * config：带有 linker 的配置
 *      * rowSupplier：执行函数，用于获取单行数据
 * 3. 使用场景：
 *      * ListSelector 的使用
 *      * TreeSelector 的使用
 *      * AddressSelector 的使用
 *      * onChange 字段专用的处理（触发专用）
 *
 * @memberOf module:write/zodiac
 * @param {Object} formValues Form中初始的 linker 相关数据值。
 * @param {Object} config linker配置信息。
 * @param {Function} rowSupplier 读取选中行的数据信息。
 * @return {Object} 返回最终表单需要设置关联字段的表单值。
 */
const writeLinker = (formValues = {}, config = {}, rowSupplier) =>
    __Zo.writeLinker(formValues, config, rowSupplier);
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    writeLinker,
    writeImpact,
    // writeReadOnly,
    // writeDisabled,
    // writeSegment,
    // writeInitial,
}