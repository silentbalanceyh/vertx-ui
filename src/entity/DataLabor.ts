import DataObject from "./data/DataObject";
import DataContainer from "./data/DataContainer";
import DataArray from "./data/DataArray";
import DataTree from './data/DataTree';
import DataRouter from "./flow/DataRouter";
import Navigator from "./flow/Navigator";
import StateIn from "./state/StateIn";
import StateOut from "./state/StateOut";
import {connect} from "react-redux";
import Taper from "../environment/actions";

/**
 * @class DataLabor
 */
class DataLabor {

    static getObject(input: Object): DataObject {
        return new DataObject(input);
    }

    static getArray(input: Array<Object>): DataArray {
        return new DataArray(input);
    }

    static getTree(input: Array<Object>, meta: any = {}): DataTree {
        return new DataTree(input, meta);
    }

    static get(input: any): DataContainer {
        if (Array.isArray(input)) {
            return DataLabor.getArray(input);
        } else if (input instanceof Object) {
            return DataLabor.getObject(input);
        }
    }

    static conn(S2P: any, Component: any, D2P: any) {
        if (!D2P) {
            D2P = {};
        }
        D2P.fnFlush = Taper.fnFlush;
        return connect(S2P, D2P)(Component);
    }

    // 状态处理
    static createIn(state: any, callback: Function): StateIn {
        return new StateIn(state, callback);
    }

    static createOut(state: any): StateOut {
        return new StateOut(state);
    }

    // 路由相关的数据信息
    static getRouter(
        props: {
            history: Object;
            location: Object;
            match: Object;
        } = {
            history: {},
            location: {},
            match: {}
        }
    ): DataRouter {
        return new DataRouter(props);
    }

    static getNavigator(input: {
        active: string;
        aside: string;
        keys: Array<String>;
    }): Navigator {
        return new Navigator(input);
    }
}

export default DataLabor;
