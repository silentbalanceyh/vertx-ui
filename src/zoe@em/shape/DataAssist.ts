import DataContainer from "./DataContainer";
import DataArray from "./DataArray";
import __Zn from "../zero.module.dependency";

class DataAssist implements DataContainer {
    ready: boolean = false;
    private data: any = {};
    private size: number = 0;

    constructor(data: Object) {
        this.size = Object.keys(data).length;
        let ready: boolean = true;
        for (const key in data) {
            // 将tabular从key中直接过滤掉
            if ("tabular" === key) {
                continue;
            }
            const value = data[key];
            this.data[key] = new DataArray(value);
            ready = ready && this.data[key].is();
        }
        this.ready = ready;
    }


    __type(): String {
        return __Zn.Env.E_TYPE.DATA_ASSIST;
    }

    to(): Object {
        if (this.ready) {
            return this.data;
        } else {
            console.warn(
                `[TS-VI] DataAssist -> The data is not the latest, 'ready' flat is ${this
                    .ready}, please reload.`
            );
        }
    }

    is(): boolean {
        return this.ready;
    }

    raw(): Object {
        const data = this.data;
        const size = this.size;
        const ready = this.ready;
        return {data, size, ready};
    }

    _(key: string): DataArray {
        if (this.ready) {
            if (key) {
                return this.data[key];
            }
        }
    }
}

export default DataAssist;
