import DataContainer from "./DataContainer";
import DataArray from './DataArray';
import __Zn from "../zero.module.dependency";

const extractData = (original: any, key: any) => {
    let keys: any = [];
    if (__Zn.isArray(key)) {
        keys = key;
    } else {
        if ("string" === typeof key) {
            if (0 <= key.indexOf('.')) {
                keys = key.split('.');
            } else {
                keys = [key];
            }
        }
    }
    let data = __Zn.immutable(original).getIn(keys);
    if (data && __Zn.isFunction(data['toJS'])) {
        // clone 拷贝，新版一律加入
        data = __Zn.clone(data['toJS']());
    }
    return data;
};

class DataObject implements DataContainer {
    ready: boolean = false;
    private data: any = {};

    constructor(data: Object) {
        this.data = data;
        this.ready = !!data;
    }


    __type(): String {
        return __Zn.Env.E_TYPE.DATA_OBJECT;
    }

    to(): Object {
        if (this.ready) {
            if (!this.data.hasOwnProperty("key") &&
                this.data.uniqueId) {
                this.data.key = this.data.uniqueId;
            }
            return __Zn.clone(this.data);
        } else {
            console.warn(
                `[TS-VI] DataObject -> The data is not the latest, 'ready' flat is ${this
                    .ready}, please reload.`
            );
        }
    }

    is(key: any = null): boolean {
        if (key) {
            if (this.ready) {
                return this.data.hasOwnProperty(key);
            } else {
                return this.ready;
            }
        } else {
            return this.ready;
        }
    }

    isEmpty(): boolean {
        return __Zn.isEmpty(this.data);
    }

    raw(): Object {
        const data = this.data;
        const ready = this.ready;
        return {data, ready};
    }


    $(key: string): DataArray {
        if (this.ready && key) {
            // @ts-ignore
            return new DataArray(extractData(this.data, key))
        } else {
            return new DataArray(undefined);
        }
    }

    /**
     * 传入属性名读取对应属性值
     * @param {string} key
     * @returns {any}
     */
    _(key: string): any {
        if (this.ready && key) {
            return extractData(this.data, key);
        }
    }

    find(key: any): any {
        return __Zn.elementGet(this.data, key);
    }

    /**
     * 设置对象中对应键的值
     * @param key
     * @param value
     */
    set(key: any, value: any): any {
        if (__Zn.isObject(key) && undefined === value) {
            if (!this.data) {
                this.data = {};
            }
            if (key) {
                Object.assign(this.data, key);
                this.ready = !!key;
            }
        } else if ("string" === typeof key) {
            if (this.ready && value) {
                // 数据有更新
                this.data[key] = value;
            }
        }
    }
}

export default DataObject;
