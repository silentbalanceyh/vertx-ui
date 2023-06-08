/**
 * # LoadingAlert
 * ## 使用
 *
 * ```js
 * // 外部标准使用
 * import {LoadingAlert} from 'web';
 * ```
 *
 * ## 组件核心点
 *
 * ### `description` 计算
 *
 * 1. 如果类型是String，则直接将description作为渲染文本基础元素来处理。
 * 2. 如果类型是Array，长度为1，则直接将第一个元素作为渲染文本来处理。
 * 3. 如果类型是Array，长度大于1，则使用`<ul/>`的列表方式渲染多行文本。
 *
 * ### `type` 执行流程
 *
 * 1. 优先选择props中的`$type`属性。
 * 2. 然后使用props中`$alert`中的`type`属性。
 * 3. 如果都没传入则使用默认值`info`。
 *
 * ### `icon` 计算流程
 *
 * 1. 优先选择props中的`$icon`属性。
 * 2. 然后使用props中`$alert`中的`icon`属性。
 * 3. 如果1和2都读取不了任何数据，则为**无图标模式**，否则为**有图标模式**。
 *
 * <hr/>
 *
 * ## props
 *
 *
 * | 参数名 | 属性 | 类型 | 含义 |
 * | --- | --- | --- | --- |
 * | $alert | | Object | 对应 AntD 中的 Alert 相关配置。|
 * | | message | String | Alert 的 message 属性：主标题。|
 * | | description | Array / String | Alert 的 description 属性，有两种格式，如果是数组格式则会自动转换为列表格式。|
 * | | type | String | Alert 的 type 属性对应：info, success, warning, error。|
 * | | hideIcon | Boolean | Alert 的 showIcon 对应：是否显示图标，采用图标模式的警告信息。|
 * | | icon | String | Alert 的 icon 属性，可自定义图标。|
 * | $type | | String | 「编程模式」优先级更高的类型说明。|
 * | $icon | | String | 「编程模式」优先级更高的图标说明。|
 * | $size | | Integer | 「编程模式」优先级更高的图标大小。|
 *
 * ## state
 *
 * （无）
 *
 * ## `示例`
 *
 * ```js
 *         return (
 *             <div>
 *                 <LoadingAlert $alert={attrAlert}/>
 *                 <ExForm {...form} $height={"300px"}
 *                         $renders={Op.renders}
 *                         $op={Op.actions}/>
 *             </div>
 *         );
 * ```
 *
 * @method LoadingAlert
 * @memberOf module:uca/zone
 */
export {LoadingAlert} from "zone";