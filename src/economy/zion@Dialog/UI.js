/**
 * ## 「组件」`Dialog`
 *
 * > 旧名称依然可用：`DynamicDialog`
 *
 * ```js
 * import { DynamicDialog } from 'web';     // 旧版本
 * import { Dialog } from 'web';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|Ok|
 *
 * ### 2. 属性说明
 *
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |className||props|String|当前窗口设置的className，默认`web-dynamic-dialog`。|
 * |children||props|Jsx|React中专用的`children`子元素信息。|
 * |$visible||props|Boolean|当前窗口是否显示（直接外层传入该变量）。|
 * |$loading||props|Boolean|当前窗口是否处于提交加载状态。|
 * |$footer||props|Jsx|是否定制过窗口的底部按钮，要重写`Ok/Cancel`时使用。|
 * |rxOk||props|Function|点击确认按钮外置函数。|
 * |rxCancel||props|Function|点击取消按钮外置函数。|
 * |$dialog||props|String/Object|String格式通过aiExprWindow转换成Object。|
 * |$dialog|title|props|String|「Ant」窗口标题。|
 * |$dialog|okText|props|String|「Ant」OK按钮使用文字。|
 * |$dialog|cancelText|props|String|「Ant」取消按钮使用文字。|
 * |$dialog|visible|props|Boolean|「Deprecated」直接使用`$visible`代替。|
 * |$dialog|width|props|Number|「Ant」窗口宽度。|
 * |$dialog|maskClosable|props|Boolean|「Ant」点击遮罩是否触发关闭动作。|
 * |$dialog|onOk|props|String|「自定义」点击`onOk`按钮触发的`Ux.connectId`锚点，该事件会被外层的`rxOk`覆盖。|
 * |$dialog|component|props|Jsx|「自定义」新版支持，窗口内的children元素的替换元素，当前组件不用，但外层解析会使用。|
 * |$ready||state|Boolean|标识当前组件已经加载完成。|
 *
 * ### 3. 组件核心点
 *
 * #### 3.1. 资源解析
 *
 * 配置信息`$dialog`的示例如（String模式）：
 *
 * `title,okText,cancelText,visible,width,maskClosable,onOk,component`
 *
 * #### 3.2. 关于$footer
 *
 * 只有okText属性没有传值时，`$footer`设置的内容才会生效，也就是说如果要定制footer，那么需要将okText设置
 * 为空字符串`""`。
 *
 * #### 3.3. 关于onOk
 *
 * onOk在不传入`rxOk`外层函数时会直接触发`Ux.connectId`去点击链接的`onOk`元素的`onClick`事件，如果传入了
 * `rxOk`则默认的链接点击行为会被废弃，而使用外层属性。
 *
 * @memberOf module:uca/zion
 * @method * Dialog
 */
export {Dialog} from 'zi';
