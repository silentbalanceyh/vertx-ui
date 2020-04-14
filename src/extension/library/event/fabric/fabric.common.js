import {DataEvent} from "entity";
import processor from "./processor";
import behavior from "./fabric.behavior";
import U from "underscore";
import Ux from "ux";
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
    if (U.isFunction(rxChannel)) {
        rxChannel(response);
    } else {
        const {rxChannel} = reference.props;
        if (U.isFunction(rxChannel)) {
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
        fabricAction(reference, behaviors);
    } catch (error) {
        console.error(error);
    }
};
export default {
    fabricAnalyzer,
    fabricBehavior
}