/**
 * ## 「组件」`DialogButton`
 *
 * ```js
 * import { DialogButton } from 'web';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * ### 2. 属性说明
 *
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |children||props|Jsx|React级别的子组件。|
 * |$content||props|Jsx|传入的子组件，该子组件优先级低于children。|
 * |$hidden||props|Boolean|是否隐藏当前按钮，如果为true则隐藏按钮。|
 * |$mode||props|String|设置三种模式：`DIALOG | DRAWER | POPOVER`。|
 * |$button||props|String/Object|调用`aiExprAction`解析该配置生成按钮专用配置。|
 * |$dialog||props|Object|不同窗口模式使用不同配置完成。|
 * |$loading||props|Boolean|是否处于提交/加载状态。|
 * |rxClick||props|Function|按钮点击的回调函数，在点击按钮设置visible=true过后执行该回调。|
 * |rxOk||props|Function|优先考虑使用外层rxOk执行该函数，如果是String则直接触发`Ux.connectId`操作。|
 * |button||state|Object|存储在当前组件的按钮配置。|
 * |dialog||state|Object|存储在当前组件的窗口配置。|
 * |visible||state|Boolean|显示/隐藏窗口专用配置。|
 * |render||state|Function|专用Jsx的渲染函数。|
 *
 * ### 3. 组件核心点
 *
 * #### 3.1. 关于子组件的计算
 *
 * 1. 过滤掉的属性表：
 *      * `$disabled`
 *      * `$button`
 *      * `$dialog`
 *      * `$mode`
 *      * `$inited`
 *      * `$content`
 * 2. 其他属性再追加`rxClose`专用方法关闭窗口进行继承。
 * 3. 内置窗口使用`Dialog`组件替换原生的`<Modal/>`操作，来完成状态注入。
 *
 * #### 3.2. 模式解析
 *
 * `$mode`设置的值生成三种不同的窗口：
 *
 * * DIALOG：弹出窗口组件`<Modal/>`。
 * * DRAWER：抽屉窗口组件`<Drawer/>`。
 * * POPOVER：浮游窗口组件`<Popover/>`。
 *
 * #### 3.3. 状态说明
 *
 * * `$loading`：组件是否处于加载状态，当前按钮的加载状态等价于提交状态，这个值会传递给子组件。
 * * `visible`：用于记录当前组件的现实和隐藏的专用属性，注意这个属性和Zero Ui规范中的`$visible`有一定区别，原因是这个组件是旧组件，历史太长，暂时没做更改。
 *
 * @memberOf module:uca/zion
 * @method * DialogButton
 */
// =====================================================
// componentInit/componentUp
// =====================================================

export {DialogButton} from 'zi';