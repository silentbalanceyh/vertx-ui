import DataAssist from "../data/DataAssist";
import DataTabular from "../data/DataTabular";
import DataObject from "../data/DataObject";
import DataArray from "../data/DataArray";
import Navigator from "../flow/Navigator";
import Dsl from "../Dsl";
import * as U from 'underscore';

const Immutable = require("immutable");

const _isTyped = (reference: any) => {
    return (
        reference instanceof DataAssist ||
        reference instanceof DataTabular ||
        reference instanceof DataObject ||
        reference instanceof DataArray ||
        reference instanceof Navigator
    );
};

class StateIn {
    private readonly mapping: any = {};
    private keys: Array<String> = [];

    constructor(mapping: any = {}, callback: Function) {
        this.mapping = mapping;
        this.keys = Object.keys(mapping);
        if (callback) {
            this.callback = callback;
        }
    }

    callback: Function = () => {
    };

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
                    const type = typeof data;
                    if (U.isArray(data) || U.isObject(data)) {
                        $state = $state.setIn(path, Dsl.get(data));
                    } else {
                        if (data) {
                            console.error(`[ StateIn ] The data type is invalid, support (Object/Array) only. \n ` +
                                `(key = ${key}, value = ${data} type = ${type})`)
                        } else {
                            $state = $state.setIn(path, Dsl.get(data));
                        }
                    }
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
