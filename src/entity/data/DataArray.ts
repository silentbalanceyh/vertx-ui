import DataContainer from './DataContainer';
import Ux from 'ux';
import {isArray} from "rxjs/util/isArray";

class DataArray implements DataContainer {
    ready: boolean = false;
    private data: string = "[]";
    private length: number = this.data.length;

    setValue(data: any = []) {
        this.data = JSON.stringify(data);
        this.ready = !!data;
        this.length = data ? data.length : 0;
    }

    constructor(data: Array<Object>) {
        this.setValue(data);
    }

    to(): Array<Object> {
        if (!this.ready) {
            console.warn(
                `[TS-VI] DataArray -> The data is not the latest, 'ready' flat is ${this
                    .ready}, please reload.`
            );
        }
        if (this.data) {
            const result = JSON.parse(this.data);
            result.forEach((item: any) => {
                // React专用
                if ("string" !== typeof item &&
                    !item.hasOwnProperty("key")) {
                    item.key = item.uniqueId;
                }
            });
            return result;
        }
    }

    is(): boolean {
        return this.ready;
    }

    raw(): Object {
        const data = JSON.parse(this.data);
        const ready = this.ready;
        const length = this.length;
        return {data, ready, length};
    }

    /**
     * 传入索引取得对应元素
     * @param {number} index
     * @returns {Object}
     */
    _(index: number): Object {
        if (this.ready) {
            if (0 <= index) {
                const data = JSON.parse(this.data);
                return data[index];
            }
        }
    }

    $(index: number, field: string): string {
        let ret = "";
        if (this.ready) {
            if (0 <= index) {
                const dataObj = JSON.parse(this.data);
                const hit = dataObj[index];
                if (hit && hit[field]) {
                    // toString for dropdown
                    ret = hit[field];
                }
            }
        }
        return ret;
    }

    push(element: any) {
        const dataArr = JSON.parse(this.data);
        dataArr.push(element);
        this.setValue(dataArr);
    }

    saveElement(element: any) {
        if (!element.key) {
            element.key = Ux.randomString(32);
        }
        // 元素信息处理
        if (!this.data) {
            this.setValue([]);
        }
        // 设置信息
        const hitted = this.searchObject('key', element.key);
        if (hitted) {
            this.updateObject(element);
        } else {
            this.push(element);
        }
    }

    getElement(key: string) {
        let result = {};
        if (this.data && key) {
            // 处理更新功能
            const dataArray = JSON.parse(this.data).filter(item => item.key === key);
            if (isArray(dataArray) && 1 === dataArray.length) {
                result = dataArray[0];
            }
        }
        return result;
    }

    removeElement(key: string) {
        // 元素信息处理
        if (!this.data) {
            this.setValue([]);
        }
        if (key) {
            // 处理删除功能
            const dataArray = JSON.parse(this.data).filter(item => item.key !== key);
            if (isArray(dataArray)) {
                this.setValue(dataArray);
            }
        }
    }

    /**
     * 设置获取当前数组的数量
     * @param count
     */
    counter(count: number): number {
        if (undefined !== count) {
            this.length = count;
        }
        return this.length;
    }

    dirty(data: Array<any>): DataArray {
        this.ready = false;
        if (data) {
            this.data = JSON.stringify(data);
        }
        return this;
    }

    // -------------- 内部自动排序函数 -------------
    asc(field: string) {
        if (field) {
            const data = JSON.parse(this.data);
            return data.sort((left: any, right: any) => {
                const leftValue = left[field];
                const rightValue = right[field];
                if (leftValue < rightValue) return -1;
                else if (leftValue > rightValue) return 1;
                else return 0;
            });
        } else {
            console.warn(
                "[TS-VI] asc/desc could not be finished because input field is undefined. field =" +
                " " +
                field
            );
            return [];
        }
    }

    desc(field: string) {
        return this.asc(field).reverse();
    }

    // -------------- 内部自动排序函数 -------------

    updateObject(element: any) {
        if (!element.key) {
            console.error("[TS-VI] Could not setObject for null key element.");
        }
        // 查找唯一元素
        const source = JSON.parse(this.data);
        for (let idx = 0; idx < source.length; idx++) {
            const item = source[idx];
            if (item && item.key === element.key) {
                source[idx] = element;
            }
        }
        this.data = JSON.stringify(source);
    }

    /**
     * 查找某个元素
     * @param field
     * @param value
     */
    searchObject(field: string, value: any) {
        if (!field) {
            console.error("[TS-VI] Could not support invalid field searching.");
            return;
        }
        // 查找唯一的元素
        const source = JSON.parse(this.data);
        let target = source.filter(item => item[field] === value);
        if (1 < target.length) {
            console.error(
                "[TS-VI] The filter could not identify the unique object."
            );
        } else {
            return 1 === target.length ? target[0] : undefined;
        }
    }
}

export default DataArray;
