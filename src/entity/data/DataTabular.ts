import DataContainer from "./DataContainer";
import DataArray from "./DataArray";

const _grouped: Function = (array: Array<Object> = []) => {
    const result: any = {};
    array.forEach((item: any) => {
        const key = item["type"];
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(item);
    });
    return result;
};

class DataTabular implements DataContainer {
    ready: boolean = false;
    private data: any = {};
    private size: number = 0;

    constructor(data: Array<Object>) {
        const grouped = _grouped(data);
        this.size = Object.keys(grouped).length;
        this.data = {};
        let ready: boolean = true;
        for (const key in grouped) {
            if (grouped.hasOwnProperty(key)) {
                const value = grouped[key];
                this.data[key] = new DataArray(value);
                ready = ready && this.data[key].is();
            }
        }
        this.ready = ready;
    }

    to(): Object {
        if (this.ready) {
            return this.data;
        } else {
            console.warn(
                `[TS-VI] DataTabular -> The data is not the latest, 'ready' flat is ${this
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
        return { data, size, ready };
    }

    _(key: string): DataArray {
        if (this.ready) {
            if (key) {
                return this.data[key];
            }
        }
    }
}

export default DataTabular;
