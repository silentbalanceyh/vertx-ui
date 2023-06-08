import __Zp from 'zep';


/**
 *
 * ## 「Monad」`Ex.etPure`
 *
 * 生成带`DataEvent`参数的专用函数，事件处理专用，处理纯事件执行，使用内置事件名称：
 *
 * * 内置事件：`FABRIC`（纯事件）
 *
 * @memberOf module:driven/upper
 * @method etPure
 * @async
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {Array} fabric 处理 fabric 数组配置。
 * @returns {Promise<T>} 返回执行的 Promise
 */
const etPure = (reference, fabric = []) =>
    __Zp.etPure(reference, fabric);

/**
 * ## 「Monad」`Ex.etParallel`
 *
 * 传入`event`是并行事件队列，每个队列中包含不同的 fabric 以及对应被影响的 target 组件信息，每个
 * 处理都是执行的 `DataEvent`。
 *
 * ```shell
 * -> Start -> DataEvent
 *          -> DataEvent
 *          -> DataEvent
 * ```
 *
 * 所有的 `DataEvent` 之间互不影响，会并行执行。
 *
 * @memberOf module:driven/upper
 * @method etParallel
 * @async
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {Object} event 并行事件配置
 * @returns {Promise<T>} 返回最终的 Promise
 */
const etParallel = (reference, event = {}) =>
    __Zp.etParallel(reference, event);

/**
 * ## 「Monad」`Ex.etSequence`
 *
 * 传入`event`中的事件队列配置，事件队列中的每一个元素可以生成对应的`DataEvent`，而且按
 * 顺序执行：
 *
 * ```shell
 * DataEvent -> DataEvent -> DataEvent -> ...
 * ```
 *
 * 整个`DataEvent`会按照事件队列依次执行。
 *
 * @memberOf module:driven/upper
 * @method etSequence
 * @async
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {Array} event 事件队列
 * @returns {Promise<T>} 返回最终的 Promise
 */
const etSequence = (reference, event = []) =>
    __Zp.etSequence(reference, event);

/**
 * ## 「Monad」`Ex.etUniform`
 *
 * event的触发流程：
 *
 * * 如果event是一个Array，则顺序执行。
 * * 如果event是一个Object，则并行执行。
 *
 * 统一事件调度专用。
 *
 * @memberOf module:driven/upper
 * @method etUniform
 * @async
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {Array|Object} event 根据事件传入数据结构判断哪一种执行方式。
 * @returns {Promise<T>} 返回执行的 Promise
 */
const etUniform = (reference, event = {}) =>
    __Zp.etUniform(reference, event);
/**
 * ## 「引擎」`Ex.rxChannel`
 *
 * ### 1.基本介绍
 *
 * `rxChannel`为顶层穿透函数，主要用于执行Extension中`Origin X`引擎专用，在整个`Ox`系列的组件中，组件和组件之间的调用流程使用Channel架构，而在Channel内部执行事件集合，它可以支持：
 *
 * * 触发事件
 * * 一次事件
 * * 并行事件
 * * 串行事件
 *
 * 组件本身调用其他组件过程时，除了执行内部方法以外，还执行`rxChannel`穿透调用。
 *
 * ### 2.核心
 *
 * #### 2.1.Fabric
 *
 * 1. 该函数会读取state中的`$fabric`变量，触发Fabric引擎。
 * 2. rxChannel通道函数多为抽象函数，本身不带任何代码逻辑，而是根据传入的Fabric配置执行不同代码逻辑。
 * 3. 代码逻辑以片段为主，定义了片段后，根据片段配置执行下一步操作。
 * 4. 其设计思路近似于`汇编`，用代码节点来编织。
 *
 * #### 2.2.rxChannel
 *
 * rxChannel方法会更新`$fabric`的变更信息，一旦变更，则会通知所有和当前`$fabric`相关的组件提示数据和配置产生了变化。
 *
 * 如下图：
 *
 * ```shell
 *                    ComponentA   ----- rxChannel触发点
 *                    /        \
 *             ComponentB     ComponentC
 *             /        \
 *       ComponentD    ComponentE
 * ```
 *
 * 例如上述结构中：
 *
 * 1. rxChannel实际上更改的是ComponentA组件中的`$fabric`状态值。
 * 2. 被更改的`$fabric`会以ComponentA为父节点，向所有子节点传递。
 * 3. 子节点中会有专用方法判断哪一部分的`$fabric`更改执行自我刷新，等价于子节点订阅了`$fabric`中的部分数据。
 *
 * 一旦配置了行为过后，这些行为就实现了相互影响和编连，对于不编程只配置的程序逻辑而言，Fabric就是核心。
 *
 * @memberOf module:driven/upper
 * @method rxChannel
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @returns {Function} 返回 $fabric 专用函数。
 */
const rxChannel = (reference) =>
    __Zp.rxChannel(reference);
/**
 * ## Fabric引擎
 *
 * 前端事件生成和调度专用。
 *
 * ### 1. DataEvent核心数据结构
 *
 * Fabric引擎中的核心数据结构是DataEvent，结构参考代码。
 *
 * ### 2. 事件配置案例
 *
 * ```json
 * {
 *      "event": {
 *          "onSelect": {
 *              "IDENTIFIER": {
 *                  "target": "73ac2517-15f9-42be-b187-e571af54ede9",
 *                  "fabric": [
 *                      "TREE_SELECT,CURRENT",
 *                      "UNIQUE,LITERAL",
 *                      "FILTER,EQ,key",
 *                      "UNIQUE,data.identifier"
 *                  ]
 *              },
 *              "RECORD": {
 *                  "target": "73ac2517-15f9-42be-b187-e571af54ede9",
 *                  "fabric": [
 *                      "TREE_SELECT,PARENT_ALL_INCLUDE",
 *                      "ZIP,INDEX_TO,0=categoryFirst`1=categorySecond`2=categoryThird"
 *                  ]
 *              },
 *              "QUERY": {
 *                  "target": "73ac2517-15f9-42be-b187-e571af54ede9",
 *                  "fabric": [
 *                      "TREE_SELECT,PARENT_ALL_INCLUDE",
 *                      "ZIP,INDEX_TO,0=categoryFirst`1=categorySecond`2=categoryThird"
 *                  ]
 *              }
 *          }
 *      }
 * }
 * ```
 *
 * 上述配置中，会生成`onSelect`事件函数，且这个时间函数会触发三个Fabric
 *
 * 1. IDENTIFIER
 * 2. RECORD
 * 3. QUERY
 *
 * 这三个Fabric的作用组件都为`73ac2517-15f9-42be-b187-e571af54ede9`，这是一个并行事件触发。
 *
 * @module driven/upper
 */
export default {
    rxChannel,

    etUniform,      // etSequence + etParallel
    etSequence,     // 串行
    etParallel,     // 并行
    etPure,         // 纯处理，不带 name 和 target 的单独 Fabric 处理流程（用于非事件型重用）
    /**
     * ## 「Monad」`Ex.acCriteria`
     * @memberOf module:driven/upper
     * @param algorithm
     * @return {*}
     */
    acCriteria: (algorithm) => __Zp.acCriteria(algorithm),
}