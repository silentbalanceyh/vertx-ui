import Ux from "ux";
import {DataEvent} from "entity";
import arithmetic from './fabric.arithmetic';
import processor from "./fabric.processor";
import behavior from "./fabric.behavior";
/*
 * 响应统一处理，生成最终的 DataEvent 的 Promise
 * 1) 如果不是 DataEvent 则直接转换成 DataEvent
 * 2）如果是 DataEvent 则直接返回
 */
const fabricResponse = async (processor, dataEvent) => {
    const finished = await processor;
    if (finished instanceof DataEvent) {
        return finished;
    } else {
        return dataEvent.end(finished);
    }
}

const fabricPassion = async (generator = [], dataEvent) => {
    try {
        if (1 === generator.length) {
            return fabricResponse(generator[0](dataEvent), dataEvent);
        } else {
            let processor = generator[0](dataEvent);
            for (let idx = 1; idx < generator.length; idx++) {
                const previous = await processor;
                if (previous instanceof DataEvent) {
                    processor = generator[idx](previous);
                } else {
                    const next = await dataEvent.next(previous);
                    processor = generator[idx](next);
                }
            }
            return fabricResponse(processor, dataEvent);
        }
    } catch (error) {
        console.error(error);
    }
};
/**
 * ## 「私有」`fabricAnalyzer`
 *
 * ### 1.基础介绍
 *
 * Fabric核心分析函数，整个事件引擎最核心的函数，最终生成：
 *
 * ```js
 * // 生成二阶函数
 * (dataEvent) => async () => {
 *     // 该二阶函数是 async 的 Promise<*> 返回
 *     // dataEvent的类型就是核心数据结构 DataEvent
 * }
 * ```
 *
 * ### 2.函数链
 *
 * 整个Fabric引擎都是`DataEvent -> DataEvent -> DataEvent -> ...`的异步Monad结构，函数链分两层
 *
 * 1. behavior：触发行为
 * 2. processor：执行细节
 *
 * #### 2.1.behavior输入
 *
 * |名称|构造变量|含义|
 * |:---|:---|:---|
 * |IDENTIFIER|$identifier|使用模型统一标识符identifier构造初始状态。|
 * |QUERY|$filters|使用condition构造初始状态。|
 * |RECORD|$record|使用normalized构造初始状态，构造记录信息。|
 * |DIALOG|$dialog|使用配置构造弹出框的初始状态。|
 *
 * #### 2.2.processor位置
 *
 * |节点位置|输入|输出|
 * |:---|:---|:---|
 * |开始节点|任意（Any）|DataEvent|
 * |中间节点|DataEvent|DataEvent|
 * |结束节点|DataEvent|state|
 *
 * processor都是「2阶」函数，它用于构造不同的「1阶」（DataEvent -> DataEvent），所有一阶函数都是DataEvent作为输入和输出。
 *
 * #### 2.3.processor执行
 *
 * |主名称|二级|节点位置|含义|
 * |:---|:---|:---|:---|
 * |INPUT|PROP|开始|根据参数查找属性中的某个变量信息，可支持`field.field1`的字段结构。|
 * |TREE_SELECT|PARENT_ALL_INCLUDE|「祖+父+自」根据传入主键，选中对应的树节点构造新的选中集。|
 * |TREE_SELECT|PARENT_ALL|「祖+父」根据传入主键，选中对应的树节点构造新的选中集。|
 * |TREE_SELECT|PARENT|「祖」根据传入主键，选中对应的树节点构造新的选中集。|
 * |TREE_SELECT|CURRENT|「自」（默认）根据传入主键，选中对应的树节点构造新的选中集。|
 * |TREE_SELECT|CHILDREN|「子」根据传入主键，选中对应的树节点构造新的选中集。|
 * |TREE_SELECT|CHILDREN_ALL|「子+孙」根据传入主键，选中对应的树节点构造新的选中集。|
 * |TREE_SELECT|CHILDREN_ALL_INCLUDE|「子+孙+自」根据传入主键，选中对应的树节点构造新的选中集。|
 * |UNIQUE|LITERAL|读取Array数据，将Array转换成唯一数据，直接读取数组中的第一个元素。|
 * |UNIQUE|`__DEFAULT__`|（默认值），读取唯一数据信息。|
 * |FILTER|EQ|过滤专用，构造等于过滤，返回boolean。|
 * |FILTER|IN|过滤条件，构造包含过滤，返回boolean。|
 * |CRITERIA|IN|构造包含条件，`field,i`的包含Qr条件。|
 * |MAP|`__DEFAULT__`|将一个Array拉平，针对拉平结果从元素中提取字段信息，支持`field.field1`的字段结构。|
 * |ZIP|INDEX_TO|根据表达式计算表达式中的索引处理，数组协变步骤。|
 * |FIELD|`__DEFAULT__`|字段名称提取，根据值提取字段。|
 * |DATUM|`__DEFAULT__`|内部调用`Ux.elementUniqueDatum`查找字典中的唯一数据集。|
 * |DIALOG|VISIBLE|设置当前状态`$visible`为true，并设置当前窗口配置存储到$current中。|
 *
 * ### 3.特殊行为
 *
 * #### 3.1.`INDEX_TO`的特殊结构说明：
 *
 * ```shell
 * // 如下边表达：
 * ZIP,INDEX_TO,0=categoryFirst`1=categorySecond`2=categoryThird
 *
 * // 输入：
 * ["A","B","C"]
 *
 * // 输出：
 * {
 *     "categoryFirst": "A",
 *     "categorySecond": "B",
 *     "categoryThird": "C"
 * }
 * ```
 *
 * @method *fabricAnalyzer
 * @memberOf module:_event
 * @param fabric
 * @returns {Function}
 */
const fabricAnalyzer = (fabric = []) => {
    const generator = fabric.map(each => {
        const expr = each.replace(/ /g, "");
        const pg = expr.split(',');
        if (processor.hasOwnProperty(pg[0])) {
            const executor = {};
            const searched = processor[pg[0]];
            const params = [];
            let paramIndex = -1;
            if (searched.hasOwnProperty(pg[1])) {
                executor.fn = searched[pg[1]];
                if (2 < pg.length) {
                    paramIndex = 2;
                }
            } else {
                executor.fn = searched["__DEFAULT__"];
                paramIndex = 1;
            }
            /*
             * 构造参数信息
             */
            if (0 < paramIndex) {
                for (let idx = paramIndex; idx < pg.length; idx++) {
                    params.push(pg[idx]);
                }
                executor.params = params;
            } else {
                executor.params = [];
            }
            executor.name = expr;
            return executor;
        } else {
            console.error(`[ EvR ] 执行器 processor 找不到："${expr}"`);
            return undefined;
        }
    }).filter(executor => undefined !== executor);
    return (dataEvent) => async () => {
        /*
         * 将 fabrics 按顺序处理
         */
        const eachGen = generator.map(each => each.fn(each.params, each.name));
        return await fabricPassion(eachGen, dataEvent);
    }
};

const fabricAction = (reference, response = {}) => {
    /*
     * 此处比较复杂
     * 1）通道函数用于顶层处理
     * - props 是顶层通道，会一层一层往下传递（低优先级）
     * - state 中是当前层通道，只会当前组件使用（高优先级，只用于编程模式）
     * 2）如果 state 中存在则执行 state 中的，否则执行 props的
     * 3）两个通道函数不可同时执行
     */
    const {rxChannel} = reference.state;
    if (Ux.isFunction(rxChannel)) {
        rxChannel(response);
    } else {
        const {rxChannel} = reference.props;
        if (Ux.isFunction(rxChannel)) {
            rxChannel(response);
        }
    }
}

const fabricBehavior = (reference) => (fabricResult = []) => {
    try {
        /*
         * 按照 target 分组
         */
        const events = {};
        fabricResult.forEach(dataEvent => {
            /*
             * 读取 target
             */
            const target = dataEvent.getTarget();
            if (!events.hasOwnProperty(target)) {
                events[target] = [];
            }
            events[target].push(dataEvent);
        });
        /*
         * 按照 target 合并
         */
        const behaviors = {};
        Object.keys(events).forEach(target => {
            const eventQueue = events[target];
            const fabricData = eventQueue.map(dataEvent => {
                const behaviorName = dataEvent.getName();
                const behaviorAction = behavior[behaviorName];
                if (Ux.isFunction(behaviorAction)) {
                    return behaviorAction(dataEvent.getPrev());
                } else {
                    return undefined;
                }
            });
            behaviors[target] = fabricData
                .filter(item => undefined !== item)
                .reduce((prev = {}, current = {}) => Ux.assign(prev, current, 1), {});
        });
        fabricAction(reference, behaviors);
    } catch (error) {
        console.error(error);
    }
};


/**
 *
 * ## 「Monad」`Ex.etPure`
 *
 * 生成带`DataEvent`参数的专用函数，事件处理专用，处理纯事件执行，使用内置事件名称：
 *
 * * 内置事件：`FABRIC`（纯事件）
 *
 * @memberOf module:_event
 * @method etPure
 * @async
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Array} fabric 处理 fabric 数组配置。
 * @returns {Promise<T>} 返回执行的 Promise
 */
const etPure = (reference, fabric = []) => {
    const fnFabric = fabricAnalyzer(fabric);
    return async dataEvent => {
        /*
         * 执行结果处理
         * 针对 fabric 中的流程节点执行核心处理，然后跳转到下一步
         * 1）input 类型的需要绑定操作
         */
        return await fnFabric(dataEvent
            .metadata({
                name: "FABRIC" // 内置事件名称，纯事件处理
            })
            .bind(reference))();
    }
}

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
 * @memberOf module:_event
 * @method etParallel
 * @async
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Object} event 并行事件配置
 * @returns {Promise<T>} 返回最终的 Promise
 */
const etParallel = (reference, event = {}) => {
    /*
     * event 的数据结构
     * {
     *     <NAME1>: {
     *         fabric: [],
     *         target: "",
     *     },
     *     <NAME2>: {
     *         fabric: [],
     *         target: "",
     *     }
     * }
     */
    const normalized = [];
    Object.keys(event)
        .filter(key => Ux.isObject(event[key]))
        .forEach(key => {
            const eventData = Ux.clone(event[key]);
            eventData.name = key;
            eventData.fnFabric = fabricAnalyzer(eventData['fabric']);
            normalized.push(eventData);
        });
    /*
     * 下边是执行区域
     */
    return (dataEvent) => Ux.parallel(
        normalized.map(item => item.fnFabric(dataEvent.bind(reference).clone(item))())
    ).then(fabricBehavior(reference))
}

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
 * @memberOf module:_event
 * @method etSequence
 * @async
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Array} event 事件队列
 * @returns {Promise<T>} 返回最终的 Promise
 */
const etSequence = (reference, event = []) => {
    /*
     * 按顺序执行，每个元素
     * {
     *      name,
     *      target,
     *      fabric
     * }
     */
    const normalized = [];
    event.filter(item => Ux.isObject(item))
        .forEach(item => {
            const eventData = Ux.clone(item);
            eventData.fnFabric = fabricAnalyzer(eventData['fabric']);
            normalized.push(eventData);
        });
    return (dataEvent) => Ux.passion(
        /*
         * 串行执行每一个事件中的 fabric
         */
        normalized.map(item => item.fnFabric(dataEvent.bind(reference).clone(item))),
        /*
         * 开始的 generator 专用参数
         */
        dataEvent,
    ).then(dataEvent => Ux.promise([dataEvent])).then(fabricBehavior(reference));
}

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
 * @memberOf module:_event
 * @method etUniform
 * @async
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Array|Object} event 根据事件传入数据结构判断哪一种执行方式。
 * @returns {Promise<T>} 返回执行的 Promise
 */
const etUniform = (reference, event = {}) => {
    /*
     * 为事件做准备，直接处理 event 的配置信息
     * 1）按顺序执行的事件：event 是一个 Array
     * 2）并行执行的事件：event 是一个 Object 并且 key 中不包含 name
     * 3）单独执行的事件：event 是一个 Object 并且 key 中不包含了 name
     */
    if (Ux.isArray(event)) {
        /*
         * 按顺序执行，每个元素
         * {
         *      name,
         *      target,
         *      fabric
         * }
         */
        return etSequence(reference, event);
    } else {
        if (Ux.isObject(event)) {
            /*
             * 并行执行每一个事件中的 fabric
             * 1）input：输入
             * - Object / Array
             * 2）data：对应属性中 props 的 data 节点
             * 多个括号执行一次才能生成真正的promise
             * 规范化事件信息
             */
            return etParallel(reference, event);
        } else {
            throw new Error("[ Ox ] event 配置格式错误")
        }
    }
}
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
 * @memberOf module:_rx
 * @method rxChannel
 * @param {ReactComponent} reference React对应组件引用。
 * @returns {Function} 返回 $fabric 专用函数。
 */
const rxChannel = (reference) => (state = {}) => {
    const {$fabric = {}} = reference.state;
    const fabricNew = Ux.clone($fabric);
    Object.assign(fabricNew, state);
    reference.setState({$fabric: fabricNew});
};
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
 * @module _event
 */
export default {
    rxChannel,

    etUniform,      // etSequence + etParallel
    etSequence,     // 串行
    etParallel,     // 并行
    etPure,         // 纯处理，不带 name 和 target 的单独 Fabric 处理流程（用于非事件型重用）
    ...arithmetic,
}