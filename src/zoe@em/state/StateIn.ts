import DataObject from "../shape/DataObject";
import DataArray from "../shape/DataArray";
import DataContainer from '../shape/DataContainer';
import __Zn from "../zero.module.dependency";

const _create = (input: any): DataContainer => {
    if (Array.isArray(input)) {
        return new DataArray(input);
    } else if (input instanceof Object) {
        return new DataObject(input);
    }
}

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
        let $state = __Zn.immutable(state);
        const reference = this.mapping;
        this.keys.forEach((key: string) => {
            if (reference.hasOwnProperty(key)) {
                const path: Array<String> = key.split(".");
                const data = reference[key];
                // 统一数据结构
                if (__Zn.isTEntity(data)) {
                    // @ts-ignore
                    $state = $state.setIn(path, data);
                } else {
                    const type = typeof data;
                    if (__Zn.isArray(data) || __Zn.isObject(data)) {
                        // @ts-ignore
                        $state = $state.setIn(path, _create(data));
                    } else {
                        if (data) {
                            console.error(`[ StateIn ] The data type is invalid, support (Object/Array) only. \n ` +
                                `(key = ${key}, value = ${data} type = ${type})`)
                        } else {
                            // @ts-ignore
                            $state = $state.setIn(path, _create(data));
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
