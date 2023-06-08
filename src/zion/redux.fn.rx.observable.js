import __Zn from './zero.module.dependency';
import __Rx from './redux.fn.data.reducer';

import {from} from "rxjs";
import {ofType} from 'redux-observable'
import {map, switchMap} from "rxjs/operators";

const __rxPrefix = (data = {}, prefix = "", order = "sort") => {
    if (prefix && !__Zn.isEmpty(data)) {
        const normalized = {};
        // eslint-disable-next-line
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const newKey = `${prefix}.${key.replace(/\./g, '_')}`;
                const value = __Zn.clone(data[key]);
                if (__Zn.isArray(value)) {
                    if (order) {
                        normalized[newKey] = value.sort(__Zn.sorterAscTFn(order));
                    } else {
                        normalized[newKey] = value;
                    }
                }
            }
        }
        return normalized;
    } else {
        return __Zn.clone(data);
    }
};

const rxEdict = (type, promise, responser = data => data) => {
    if (type && __Zn.isFunction(promise)) {
        return $action => {
            // Modified to fix: $action.ofType is not function
            const actionType = $action.pipe(ofType(type.getType()));
            const source = from(actionType);
            return source.pipe(
                map(action => action.payload),
                map(promise),
                switchMap(promise => from(promise).pipe(
                    map(responser),
                    map(__Zn.fxRedux),
                    map(data => __Rx.dataOut(data))
                ))
            );
        };
    } else {
        __Zn.fxTerminal(true, 10027, type, promise);
    }
};

const rxDatum = (input, orderField = 'sort', groupField = 'type') => {
    let data;
    if (__Zn.isArray(input)) {
        /*
         * 直接修改，data 为数组，按 type 执行 group by
         */
        let $array = __Zn.immutable(input);
        $array = $array.groupBy(item => item.get(groupField));
        data = $array.toJS();
    } else {
        data = __Zn.clone(input);
    }
    return __rxPrefix(data, 'tabular', orderField);
};

const rxAssist = (input, key, order = 'sort') => {
    const response = {};
    response[key] = __Zn.valueArray(input);
    return __rxPrefix(response, 'assist', order);
}

export default {
    rxEdict,
    rxDatum,
    rxAssist,
}