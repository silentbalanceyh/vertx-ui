import U from "underscore";
import {from} from "rxjs";
import {map, switchMap} from 'rxjs/operators';
import E from "../error";
import Rdx from "../entity";

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
                    map(E.mapRedux),
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