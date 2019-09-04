import U from "underscore";
import Rx from "rxjs";

import E from "../error";
import Rdx from "../entity";

const rxEdict = (type, promise, responser = data => data) => {
    if (type && U.isFunction(promise)) {
        return $action => {
            const actionType = $action.ofType(type.getType());
            return Rx.Observable.from(actionType)
                .map(action => action.payload)
                .map(promise)
                .switchMap(promise => Rx.Observable.from(promise)
                    .map(responser)
                    .map(E.mapRedux)
                    .map(data => Rdx.dataOut(data))
                );
        };
    } else {
        E.fxTerminal(true, 10027, type, promise);
    }
};

export default {
    rxEdict
}