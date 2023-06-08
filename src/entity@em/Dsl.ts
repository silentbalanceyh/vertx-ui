import RxEtat from './rx/Rx.Etat';
import RxOf from './rx/Rx.Of';
import RxCodex from './rx/Rx.Codex';
import {QQuery} from 'zmr';

import {DataArray, DataContainer, DataEvent, DataObject, DataRouter, Navigator, StateIn, StateOut} from 'zme';

/**
 * @class Dsl
 */
class Dsl {
    /*
     * Rx系列
     */
    static rxEtat(requiredFile: any): RxEtat {
        return RxEtat.from(requiredFile);
    }

    /*
     * 高频流式Api处理
     */
    static of(reference: any): RxOf {
        return RxOf.from(reference);
    }

    static codex(reference: any): RxCodex {
        return RxCodex.from(reference);
    }

    /*
     * Data Object / Array 系列
     */
    static getObject(input: Object): DataObject {
        return new DataObject(input);
    }

    static getArray(input: Array<Object>): DataArray {
        return new DataArray(input);
    }

    static getEvent(data: any): DataEvent {
        return new DataEvent(data);
    }

    static getQuery(query: any, reference): QQuery {
        return new QQuery(query, reference);
    }

    /*
     * Common 系列
     */
    static get(input: any): DataContainer {
        if (Array.isArray(input)) {
            return Dsl.getArray(input);
        } else if (input instanceof Object) {
            return Dsl.getObject(input);
        }
    }

    /*
     * Redux 状态进出
     */
    static createIn(state: any, callback: Function): StateIn {
        return new StateIn(state, callback);
    }

    static createOut(state: any): StateOut {
        return new StateOut(state);
    }

    /*
     * 路由和导航相关数据
     */
    static getRouter(props, metadata: any): DataRouter {
        return new DataRouter(props, metadata);
    }

    static getNavigator(input): Navigator {
        return new Navigator(input);
    }
}

export default Dsl;
