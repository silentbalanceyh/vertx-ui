import U from 'underscore';
import Ux from 'ux';
import {DataEvent} from 'entity';

import processor from './processor';
import behavior from './fabric.behavior';

const fabricPassion = async (generator = [], dataEvent) => {
    try {
        if (1 === generator.length) {
            // 这种模式下必须是 generator，而不是promise
            return await generator[0](dataEvent);
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
            const finished = await processor;
            if (finished instanceof DataEvent) {
                return finished;
            } else {
                return dataEvent.end(finished);
            }
        }
    } catch (error) {
        console.error(error);
    }
};

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
                if (U.isFunction(behaviorAction)) {
                    return behaviorAction(dataEvent.getPrev());
                } else {
                    return undefined;
                }
            });
            behaviors[target] = fabricData
                .filter(item => undefined !== item)
                .reduce((prev = {}, current = {}) => Ux.assign(prev, current, 1), {});
        });
        /*
         * 调用 rxChannel 函数
         */
        const {rxChannel} = reference.props;
        if (U.isFunction(rxChannel)) {
            rxChannel(behaviors);
        }
    } catch (error) {
        console.error(error);
    }
};

export default (reference, event = {}) => {
    /*
     * 为事件做准备，直接处理 event 的配置信息
     * 1）按顺序执行的事件：event 是一个 Array
     * 2）并行执行的事件：event 是一个 Object 并且 key 中不包含 name
     * 3）单独执行的事件：event 是一个 Object 并且 key 中不包含了 name
     */
    if (U.isArray(event)) {
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
            normalized.map(item => item.fnFabric(dataEvent.clone(item))),
            /*
             * 开始的 generator 专用参数
             */
            dataEvent,
        ).then(dataEvent => Ux.promise([dataEvent]))
            .then(fabricBehavior(reference))
    } else {
        if (Ux.isObject(event)) {
            /*
             * 规范化事件信息
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
                /*
                 * 并行执行每一个事件中的 fabric
                 * 1）input：输入
                 * - Object / Array
                 * 2）data：对应属性中 props 的 data 节点
                 * 多个括号执行一次才能生成真正的promise
                 */
                normalized.map(item => item.fnFabric(dataEvent.clone(item))())
            ).then(fabricBehavior(reference))
        } else {
            throw new Error("[ Ox ] event 配置格式错误")
        }
    }
}