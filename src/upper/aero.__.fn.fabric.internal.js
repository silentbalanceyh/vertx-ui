import Ux from "ux";
import {DataEvent} from "entity";
import __AERO_DEF from './variant-aero';
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
        if (__AERO_DEF.PROCESSOR.hasOwnProperty(pg[0])) {
            const executor = {};
            const searched = __AERO_DEF.PROCESSOR[pg[0]];
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
                const behaviorAction = __AERO_DEF.BEHAVIOR[behaviorName];
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
export default {
    fabricAction,
    fabricPassion,
    fabricBehavior,
    fabricAnalyzer,
    fabricResponse
}