import U from "underscore";
import {from} from "rxjs";
import {map, switchMap} from 'rxjs/operators';
import E from "../error";
import Rdx from "../entity";
/**
 * # 内部模块
 *
 * Rx响应式模块
 *
 * @module _rx
 */

/**
 * ## 标准函数
 *
 * 基于 Observable 的 Redux 函数，和 Ajax 相关的响应式函数，框架内的使用代码如下：
 *
 * ```js
 * export default {
 *     // 读取 tabular 的专用 redux 类型的响应式 Ajax 处理
 *     epicTabular: Ux.rxEdict(Types.epicTabular, I.tabular, data => Ux.rxDatum(data))
 * }
 * ```
 *
 * EmptyActionCreator 的原始创建代码如下：
 *
 * ```js
 * import createAction from 'redux-act';
 * const action = createAction("REDUX//ACTION//NAME");
 * ```
 *
 * @async
 * @param {EmptyActionCreator} type 创建好的 Redux 中的 Action，和 `redux-act` 绑定
 * @param {Promise<T>} promise 构造的Ajax类型的异步Promise
 * @param {Function} responser 响应处理器，默认使用 `data => data` 不执行任何处理，需要转换则直接执行转换。
 * @return {Observable<*>} 返回 redux 和 rxjs 中的核心监听对象，用于执行最终输出
 */
const rxEdict = (type, promise, responser = data => data) => {
    if (type && U.isFunction(promise)) {
        return $action => {
            const actionType = $action.ofType(type.getType());
            const source = from(actionType);
            return source.pipe(
                map(action => action.payload),
                map(promise),
                switchMap(promise => from(promise).pipe(
                    map(responser),
                    map(E.fxRedux),
                    map(data => Rdx.dataOut(data))
                ))
            );
        };
    } else {
        E.fxTerminal(true, 10027, type, promise);
    }
};

export default {
    rxEdict
}