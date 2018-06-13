import DataContainer from "./DataContainer";
import * as Immutable from 'immutable';

class DataObject implements DataContainer {
    ready: boolean = false;
    private data: any = {};

    constructor(data: Object) {
        this.data = data;
        this.ready = !!data;
    }

    to(): Object {
        if (this.ready) {
            if (!this.data.hasOwnProperty("key")) {
                this.data.key = this.data.uniqueId;
            }
            return this.data;
        } else {
            console.warn(
                `[TS-VI] DataObject -> The data is not the latest, 'ready' flat is ${this
                    .ready}, please reload.`
            );
        }
    }

    is(): boolean {
        return this.ready;
    }

    raw(): Object {
        const data = this.data;
        const ready = this.ready;
        return {data, ready};
    }

    /**
     * 传入属性名读取对应属性值
     * @param {string} key
     * @returns {any}
     */
    _(key: string): any {
        if (this.ready && key) {
            let keys = [key];
            if (0 <= key.indexOf('.')) {
                keys = key.split('.');
            }
            let data = Immutable.fromJS(this.data).getIn(keys);
            if (data && data.toJS) {
                data = data.toJS();
            }
            return data;
        }
    }

    /**
     * 设置对象中对应键的值
     * @param key
     * @param value
     */
    set(key: string, value: any): any {
        if (this.ready && value) {
            // 数据有更新
            this.data[key] = value;
        }
    }
}

export default DataObject;
