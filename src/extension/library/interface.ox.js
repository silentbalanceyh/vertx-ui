import {_ox} from 'zep';

/**
 * # Origin X专用注解
 *
 * ## 1.基本使用
 *
 * 使用方法：
 *
 * ```js
 * import Ex from 'ex';
 *
 * &#64;Ex.ox() -- 注释掉的调用方法，由于包含 @ 符号不可解析
 * class Component extends React.Component{
 *
 * }
 * ```
 *
 * 该注解用于高阶组件，使用Hoc方式对定义的React组件执行注解操作，采用ES7中的修饰语法
 *
 * ### 1.1.参数
 *
 * `options`中目前包括两个核心值：
 *
 * |值|含义|
 * |:---|:---|
 * |Page|页面动态渲染。|
 * |Control|控件动态渲染。|
 *
 * ### 1.2.加载
 *
 * 组件执行后会检查`$ready`的值：
 *
 * 1. `$ready=true`：表示当前组件的配置已经加载完成。
 * 2. 该组件没有`componentDidUpdate`的生命周期，仅处理componentDidMount。
 *
 * 由于`@ox`注解主要是针对不同组件执行配置加载，一旦加载不可更改，所以只有`componentDidMount`的生命周期，而没有更新周期。
 *
 * ## 2.`hocFn`核心函数
 *
 * > 输入数据全部来自于`props`属性集。
 *
 * `options`参数结构：
 *
 * ```js
 * const hoc = {
 *      "Page": hocPage,
 *      "Control": hocControl
 * };
 * ```
 *
 * |类型|函数|
 * |:---|:---|
 * |Page|hocPage执行页面渲染。|
 * |Control|hocControl执行组件渲染。|
 *
 * ### 2.1.hocPage
 *
 * #### 2.1.1.输入处理
 *
 * |变量名|含义|
 * |:---|:---|
 * |$assist|辅助数据专用定义，定义了所有当前系统中要使用的辅助数据信息。|
 * |$grid|根据当前页面`app,module,page`读取的`UI_LAYOUT, UI_PAGE`中的布局信息（全部使用Grid布局）。|
 * |$container|容器信息，包含容器组件和容器配置两部分。|
 * |$controls|页面信息，包含页面组件和组件配置两部分。|
 *
 * #### 2.1.2.构造内容
 *
 * 1. 构造内部专用`HocI18r`对象，资源配置对象。
 * 2. 传入`$router`中的基础数据，根据`$controls`组件配置计算完整布局配置，生成`$grid`变量。
 * 3. 根据`$container`计算容器组件和容器配置。
 * 4. 根据`$assist`计算当前页面需要使用的所有辅助数据信息信息（远程调用读取数据），统一结构。
 * 5. 注入顶层`rxChannel`专用通道函数。
 *
 * ### 2.2.hocControl
 *
 * #### 2.2.1.输入数据
 *
 * |变量名|含义|
 * |:---|:---|
 * |rxChannel|「Fabric引擎」上层注入的通道函数。|
 * |event|当前组件对应的事件配置信息。|
 *
 * #### 2.2.2.构造内容
 *
 * 在当前组件状态中，调用`Ex.etUniform`构造事件链结构
 *
 * 1. 并行构造：`etParallel`，传入的`event[eventName]`是Object结构。
 * 2. 串行构造：`etSequence`，传入的`event[eventName]`是Array结构。
 *
 * > 根据`event`结构构造同样的事件信息，并注入到state状态中。
 *
 * @method @ox
 * @param {Object} options 配置项信息
 *
 */
export default _ox;