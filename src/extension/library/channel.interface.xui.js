import __Zu from 'zet';
// =====================================================
// 主体渲染方法
// =====================================================
/**
 * ## 「动态」`Ex.xuiContainer`
 *
 * ### 1.基本介绍
 *
 * 执行 `xuiContainer` 专用容器控件渲染，该函数主要用于渲染容器基础配置，该函数支持两种渲染模式：
 *
 * 1. 无容器模式：`container`无配置，为空。
 * 2. 有容器模式：`container`中有内容，带容器渲染。
 *
 * ### 2.参数说明
 *
 * 1. container：容器配置信息，对应后端的`containerConfig`配置对象。
 * 2. UI：配置专用组件`import UI from 'oi';`，专用于配置的核心组件定义（Ox组件）。
 * 3. inherit：继承属性集，构造继承属性，连接原生`yoAmbient`构造的属性集。
 * 4. fnJsx：「Jsx渲染函数」组件专用Jsx渲染函数，容器函数会笼罩在`fnJsx`外围。
 *
 * ### 3.追加属性
 *
 * > 除开`Ex.yoAmbient`函数构造的属性集以外，当前函数会追加特定属性信息
 *
 * |属性名|含义|
 * |:---|:---|
 * |key|配置中的组件key信息，来自于container.config.key键值。|
 * |$metadata|元数据信息，记录了组件key，组件名称，页面ID，组件类型等。|
 * |$fabric|从props和state中构造所有Fabric引擎所需的基础配置。|
 * |$controls|组件配置，存储了当前页面所需的所有配置信息。|
 *
 * #### 3.1.$metadata结构
 *
 * ```js
 * {
 *     key: "组件key",
 *     type: "组件名称，系统会根据该名称读取容器组件",
 *     page: "当前配置中的pageId，页面ID",
 *     componentType: "当前容器类型"
 * }
 * ```
 *
 * #### 3.2.$controls加锁
 *
 * $controls变量会在读取完成后执行加锁`Object.freeze`操作，一旦加锁后，该配置信息不可被更改（只读）。
 *
 * #### 3.3.递归渲染
 *
 * 在`container + component`结构中，还允许`component`定义自我容器，如果出现自我容器，则容器会构造两层，如：
 *
 * ```jsx
 * <Container>
 *     <SelfContainer>
 *         <Component/>
 *     </SelfContainer>
 * </Container>
 * ```
 *
 * * Container：外层容器配置的基础信息`containerConfig`。
 * * SelfContainer：内层容器配置的基础信息。
 * * Component：组件本身以及组件基础配置。
 * * `SelfContainer + Component`等价于`xuiControl`的内容。
 *
 * @memberOf module:xui/utter
 * @method xuiContainer
 * @param {Object} container 容器配置信息
 * @param {Object} UI 组件配置
 * @param {Object} inherit 将被继承的属性表
 * @param {Function} fnJsx 容器中组件渲染专用函数
 * @returns {boolean|Jsx} 渲染带容器的组件信息
 */
const xuiContainer = (container = {}, UI = {}, inherit, fnJsx) =>
    __Zu.xuiContainer(container, UI, inherit, fnJsx);

/**
 * ## 「动态」`Ex.xuiDecorator`
 *
 * ### 1.基本介绍
 *
 * 执行 `xuiDecorator` 修饰包装组件。
 * 1. 提取 control 中的配置信息
 * 2. 是否执行了 $switcher 的随机跳跃处理（刷新界面专用）
 * 3. 事件执行器，针对特殊节点：`decorator` 执行事件注入解析工作
 *
 * ### 2.xuiControl解析流程
 *
 * 根据传入的配置信息，构造组件配置。
 *
 * #### 2.1.基础流程：
 *
 * * 如果`isContainer = true`，证明当前组件带容器配置，先渲染容器，再渲染组件。
 * * 如果提取了`control.name`，从`UI`中构造的组件，则执行组件渲染。
 * * 如果内置包含了`control.container`，则构造内置容器。
 *
 * #### 2.2.继承属性：
 *
 * |属性名|含义|
 * |:---|:---|
 * |data|构造当前组件所需的数据信息，调用`seekData`方法执行计算（只能同步操作）。|
 * |config|构造当前组件所需的配置信息。|
 * |event|事件专用配置信息，该事件会在内部执行Fabric引擎。|
 *
 * @memberOf module:xui/utter
 * @method xuiDecorator
 * @param {Object} configuration 修饰组件专用配置数据
 * @param {Object} UI 组件配置
 * @param {Object} inherit 将被继承的属性表
 * @param {State} state 组件专用状态信息
 * @returns {boolean|Jsx} 渲染修饰过的组件
 */
const xuiDecorator = (configuration = {}, UI = {}, inherit = {}, state = {}) =>
    __Zu.xuiDecorator(configuration, UI, inherit, state);
/**
 * ## 「动态」`Ex.xuiGrid`
 *
 * ### 1.基本介绍
 *
 * 执行 `xuiGrid` 专用Grid控件布局，执行每个单元格的渲染操作，Grid执行行列渲染。每个单元格内部：
 *
 * 1. xuiCell：执行单元格内容渲染。
 * 2. xuiColumn：执行单元格属性渲染`<Col/>`元素。
 *
 * ### 2.xuiCell
 *
 * xuiCell用于构造`fnJsx`函数，内置会递归执行：
 *
 * 1. xuiGrid：`rows`配置。
 * 2. xuiDecorator：`control`配置。
 *
 * ### 3.最终骨架
 *
 * 最终骨架代码：
 *
 * #### 3.1.容器部分
 *
 * ```jsx
 * <Container>
 *     <SelfContainer>
 *         <Component/>
 *     </SelfContainer>
 * </Container>
 * ```
 *
 * #### 3.2.网格部分
 *
 * 上边骨架中的`<Component/>`部分
 *
 * ```jsx
 * <Row>
 *     <Col>
 *          {xuiGrid}
 *          {xuiDecorator}
 *     </Col>
 * </Row>
 * ```
 *
 *
 * @memberOf module:xui/utter
 * @method xuiGrid
 * @param {Array<Array>} grid Grid布局专用二维数组配置
 * @param {Object} UI 组件配置
 * @param {Object} inherit 将被继承的属性表
 * @returns {Jsx} 渲染行列`<Row>, <Col>`的Grid组件
 */
const xuiGrid = (grid = [], UI = {}, inherit = {}) =>
    __Zu.xuiGrid(grid, UI, inherit);
export default {
    xuiGrid,
    xuiContainer,
    xuiDecorator,
}