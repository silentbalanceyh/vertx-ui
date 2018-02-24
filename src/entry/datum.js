import { combineReducers } from "redux";
import { createReducer } from "redux-act";
import { routerReducer } from "react-router-redux";
import { combineEpics } from "redux-observable";

import datum from "../environment/datum";
import out from "../environment/reducers";

const { handlers = {} } = datum;

const createEpics = () => {
    const actionHandler = {};
    for (const key in handlers) {
        const fnHandler = handlers[key];
        if (Function.prototype.isPrototypeOf(fnHandler)) {
            actionHandler[key] = fnHandler;
        }
    }
    return createReducer(actionHandler, {});
};

const epics = [];
for (const key in datum.epics) {
    if (datum.epics.hasOwnProperty(key)) {
        epics.push(datum.epics[key]);
    }
}
console.info(epics);
export default {
    epics: combineEpics.apply(this, epics),
    reducers: combineReducers({
        routing: routerReducer,
        do: createEpics(),
        out
    })
};
