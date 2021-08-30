import DataContainer from "./DataContainer";
import DataArray from './DataArray';
import * as Immutable from 'immutable';
import * as U from 'underscore';
import Ux from 'ux';

const extractData = (original: any, key: any) => {
    let keys: any = [];
    if (U.isArray(key)) {
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
    let data = Immutable.fromJS(original).getIn(keys);
    if (data && data.toJS) {
        data = data.toJS();
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

    to(): Object {
        if (this.ready) {
            if (!this.data.hasOwnProperty("key") &&
                this.data.uniqueId) {
                this.data.key = this.data.uniqueId;
            }
            return Ux.clone(this.data);
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
        return Ux.isEmpty(this.data);
    }

    raw(): Object {
        const data = this.data;
        const ready = this.ready;
        return {data, ready};
    }


    $(key: string): DataArray {
        if (this.ready && key) {
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
        return Ux.elementGet(this.data, key);
    }

    /**
     * 设置对象中对应键的值
     * @param key
     * @param value
     */
    set(key: any, value: any): any {
        if (Ux.isObject(key) && undefined === value) {
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
