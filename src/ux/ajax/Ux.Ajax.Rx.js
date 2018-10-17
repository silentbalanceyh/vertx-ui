import U from "underscore";
import Cv from "../Ux.Constant";
import Rx from "rxjs";
import Log from "../monitor/Mt.Logger";
import Env from "../Ux.Env";
import E from "../Ux.Error";
import Type from "../Ux.Type";
import Immutable from "immutable";


/**
 * 统一处理Epic，引入Mock的RxJs处理远程访问
 * @method rxEpic
 * @param type redux-act创建出来的Redux Action
 * @param promise 构造的Promise
 * @param processor 响应数据处理器，可用于处理response中的数据
 * @param mockData 【Mock环境可用】模拟数据
 * @example
 *
 *      // Act.Epic.js中的专用方法
 *      fnFetchRoomType : $action => Ux.rxEpic(
 *          $action.ofType(Types.fnFetchRoomType.getType()),
 *          hotel => Ux.ajaxGet("/api/room-types/hotel/:hid", {
 *              hid : hotel.key
 *          }),
 *          data => Ux.rxAssist(data, "room.type"),
 *          Mock.fnFetchRoomType
 *      )
 */
const rxEpic = (type, promise, processor = data => data, mockData = {}) => {
    if (type && U.isFunction(promise)) {
        // 触发Mock条件
        // 1. 打开Mock环境
        // 2. 提供Mock数据
        if (Cv.MOCK && mockData.mock) {
            let processed = mockData.data;
            return Rx.Observable.from(type)
                .map(action => action.payload)
                .map(data => Log.mock(data, mockData.processor ? mockData.processor(processed, data) : processed))
                .map(processor)
                .map(data => Env.dataOut(data));
        } else {
            // 非Mock模式
            return Rx.Observable.from(type)
                .map(action => action.payload)
                .map(promise)
                .switchMap(promise =>
                    Rx.Observable.from(promise)
                        .map(processor)
                        .map(data => Env.dataOut(data))
                );
        }
    } else {
        E.fxTerminal(true, 10025, type, promise);
    }
};

const _rxLog = (data) => {
    Log.debug(data);
    return data;
};
/**
 * 【Epic升级版】统一处理Epic，新函数，简化操作，替换rxEpic专用
 * @method rxEdict
 * @param type 专用Action
 * @param promise 构造的promise，这个版本Promise中的Mock直接包含在内
 * @param responser 后期响应处理
 * */
const rxEdict = (type, promise, responser = data => data) => {
    if (type && U.isFunction(promise)) {
        return $action => {
            const actionType = $action.ofType(type.getType());
            return Rx.Observable.from(actionType)
                .map(action => action.payload)
                .map(promise)
                .switchMap(promise => Rx.Observable.from(promise)
                    .map(responser)
                    .map(_rxLog)
                    .map(data => Env.dataOut(data))
                );
        };
    } else {
        E.fxTerminal(true, 10027, type, promise);
    }
};

const _rxPromise = (container, nextPromise = []) => {
    // 读取第一个promise
    const middles = {};
    let promise;
    const rxNext = (index, data) => {
        container.next[index] = data;
        return Promise.resolve(data);
    };
    for (let idx = 0; idx < nextPromise.length; idx++) {
        if (promise) {
            promise = promise.then(data => {
                middles[idx] = data;
                return nextPromise[idx](container.request, container.response, middles)
                    .then(data => rxNext(idx, data));
            });
        } else {
            promise = nextPromise[idx](container.request, container.response)
                .then(data => rxNext(idx, data));
        }
    }
    return promise;
};
const _rxState = (container, responser, nextPromise = []) => {
    // 合并最后的状态
    const state = {};
    const responseData = responser(container.response);
    if (responseData) {
        Object.assign(state, responseData);
    }
    const processors = nextPromise.map(item => item.processor);
    Type.itObject(container.next, (key, value) => {
        const fun = processors[key];
        if (U.isFunction(fun)) {
            const itemData = fun(value);
            Type.itObject(itemData, (mergeKey, mergeData) => {
                if (state.hasOwnProperty(mergeKey)) {
                    state[mergeKey] = Object.assign(state[mergeKey], mergeData);
                } else {
                    state[mergeKey] = mergeData;
                }
            });
        }
    });
    //console.warn(Immutable.fromJS(state).toJS())
    return state;
};

const _rxParams = (container, params, key = "request") => {
    if (container) container[key] = params;
    return params;
};

const rxEclat = (type, promise, responser = data => data, nextPromise = []) => {
    if (type && U.isFunction(promise)) {
        return $action => {
            const actionType = $action.ofType(type.getType());
            // 链式结构
            const container = {};
            container.next = Immutable.fromJS({}).toJS();
            return Rx.Observable.from(actionType)
                .map(action => action.payload)
                .map(params => _rxParams(container, params))
                .map(promise)
                // 触发后续流程专用的nextPromise
                .map(promise => promise
                    .then(data => Promise.resolve(_rxParams(container, data, "response")))
                    .then(() => _rxPromise(container, nextPromise.map(item => item.ajax)))
                )
                .switchMap(promise => Rx.Observable.from(promise)
                    .map(() => _rxState(container, responser, nextPromise))
                    .map(data => Env.dataOut(data))
                );
        };
    } else {
        E.fxTerminal(true, 10026, type, promise, nextPromise);
    }
};

export default {
    rxEpic,
    // 单个Ajax的Promise
    rxEdict,
    // 连接两个Ajax的Promise，后一个和前一个存在依赖关系
    rxEclat,
};