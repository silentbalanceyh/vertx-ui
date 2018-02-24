import * as Immutable from "immutable";
import DataObject from "../data/DataObject";
import DataArray from "../data/DataArray";
import Navigator from "../flow/Navigator";
import DataLabor from "../DataLabor";

const _isTyped = (reference: any) => {
    return (
        reference instanceof DataObject ||
        reference instanceof DataArray ||
        reference instanceof Navigator
    );
};

class StateIn {
    private mapping: any = {};
    private keys: Array<String> = [];
    callback: Function = () => {};

    constructor(mapping: any = {}, callback: Function) {
        this.mapping = mapping;
        this.keys = Object.keys(mapping);
        if (callback) {
            this.callback = callback;
        }
    }

    to(state: any = {}) {
        let $state = Immutable.fromJS(state);
        const reference = this.mapping;
        this.keys.forEach((key: string) => {
            if (reference.hasOwnProperty(key)) {
                const path: Array<String> = key.split(".");
                const data = reference[key];
                // 统一数据结构
                if (_isTyped(data)) {
                    $state = $state.setIn(path, data);
                } else {
                    $state = $state.setIn(path, DataLabor.get(data));
                }
            }
        });
        // 回调执行
        const payload: Object = $state.toJS();
        if (this.callback) {
            this.callback(payload);
        }
        return payload;
    }
}

export default StateIn;
