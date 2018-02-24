import { createStore, applyMiddleware, compose } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { createLogger } from "redux-logger";

import datum from "./datum";
// Development Tools
const DEVTOOL = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const composeEnhancers =
    "production" !== process.env.NODE_ENV && DEVTOOL ? DEVTOOL({}) : compose;

// Inject middleware: Epic, Router
const epicMiddleware = createEpicMiddleware(datum.epics);
const logger = createLogger({ duration: false, diff: true, collapsed: true });
const enhancer =
    "production" !== process.env.NODE_ENV
        ? composeEnhancers(
              applyMiddleware(epicMiddleware),
              applyMiddleware(logger)
              // other store enhancers if any
          )
        : composeEnhancers(
              applyMiddleware(epicMiddleware)
              // other store enhancers if any
          );
// Initialize the store of current.
const store = createStore(datum.reducers, {}, enhancer);
export default () => store;
