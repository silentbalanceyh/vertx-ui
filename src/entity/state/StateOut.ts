import * as Immutable from "immutable";
import Ux from 'ux';
import DataContainer from "../data/DataContainer";
import DataArray from "../data/DataArray";
import DataObject from "../data/DataObject";

const _path = (input: string): Array<String> => {
    if (input) {
        let path: any = null;
        // 处理左值路径
        if (0 < input.indexOf(".")) {
            path = input.split(".");
        } else {
            path = [input];
        }
        return path;
    } else return null;
};

const _zipper = (state = {}, mapping: any = {}, fnEach: Function): void => {
    if (fnEach) {
        const $state = Immutable.fromJS(state);
        for (const key in mapping) {
            if (mapping.hasOwnProperty(key)) {
                /**
                 * 读取mapping中的key值，该值有两种：
                 * 1.如果value为true，则路径为[key]
                 * 2.如果value为数组，则每个数据组合成[key].concat(ikey);
                 */
                const values: any = mapping[key];
                if (Array.isArray(values)) {
                    const path = _path(key);
                    values.forEach((ikey: string) => {
                        const data = $state.getIn(path.concat(ikey));
                        if (data) {
                            // key = data中参数倒序
                            fnEach(data, ikey);
                        }
                    });
                } else if (true === values) {
                    const path = _path(key);
                    const data = $state.getIn(path);
                    if (data) {
                        fnEach(data, key);
                    }
                }
            }
        }
    } else {
        console.warn("[TS-VI] The function 'fnEach' must be a Function.");
    }
};

class StateOut {
    private state: any = {};
    private response: any = {};

    constructor(state: Object) {
        this.state = state;
        this.response = {};
    }

    /**
     *
     * 初始值处理，后调用函数
     *
     * @param {Array<String>} [keys=[]]
     * @param {boolean} isArray
     * @memberof StateOut
     */
    rinit(keys: Array<String> = [], isArray: boolean = false) {
        const reference = this.response;
        keys.forEach((key: string) => {
            const targetKey = `$${key}`;
            if (!reference[targetKey]) {
                if (isArray) {
                    reference[targetKey] = new DataArray(undefined);
                } else {
                    reference[targetKey] = new DataObject(undefined);
                }
            }
        });
        return this;
    }


    /**
     * 针对keys中的数组处理，单纯的节点数据处理
     * @param keys = []
     * 每一个key对应的信息如下：
     * state.out.key -> DataObject/DataArray
     * $key = DataObject/DataArray
     * @returns {StateOut}
     */
    revamp(keys: Array<String> = []): StateOut {
        const $state = Immutable.fromJS(this.state.out);
        const reference = this.response;
        keys.forEach((key: string) => {
            if ("assist" === key || "tabular" === key) {
                console.warn(
                    "[TS-VI] Please use 'radial' method instead for normalization."
                );
            } else {
                const path: Array<String> = key.split(".");
                let data = $state.getIn(path);
                if (data) {
                    reference[`$${key}`] = data;
                }
            }
        });
        return this;
    }

    /**
     * 针对Tabular和Assist的特殊读取
     * @param keys
     * @param isAssist
     */
    radial(keys: any, isAssist: boolean = false): StateOut {
        const $state = Immutable.fromJS(this.state.out);
        const reference = this.response;
        // 遍历路径
        keys.forEach((key: string) => {
            key = key.replace(/\./g, '_');
            const path = isAssist ? ["assist"] : ["tabular"];
            let data = $state.getIn(path.concat(key));
            const targetKey = isAssist ? `$a_${key}` : `$t_${key}`;
            reference[targetKey] = data;
        });
        return this;
    }

    /**
     * 针对mapping中的映射处理，协变节点，反向映射处理
     * @param mapping = {}
     * key = Array
     * 最终生成的对象如
     *
     * @returns {StateOut}
     */
    rework(mapping: any = {}): StateOut {
        const reference = this.response;
        _zipper(this.state.out, mapping, (data: DataContainer, key: string) => {
            reference[`$${key}`] = data;
        });
        return this;
    }

    /**
     * rework专用协变函数
     * @param mapping
     * @param vector
     */
    rapt(mapping: any = {}, vector: any = {}): StateOut {
        const reference = this.response;
        _zipper(this.state.out, mapping, (data: DataContainer, key: string) => {
            const target = vector[key];
            if (target) {
                reference[`$${target}`] = data;
            }
        });
        return this;
    }

    /**
     * 强制更新，引入特殊变量
     */
    rush() {
        this.response["$forceUpdate"] = Ux.randomString(16);
        return this;
    }

    /**
     *
     * @param path
     */
    navigator(path: any): StateOut {
        path = path.split(".");
        if (Array.isArray(path)) {
            const $state = Immutable.fromJS(this.state.out);
            this.response[`$navigator`] = $state.getIn(path);
        }
        return this;
    }

    /**
     * 最终处理
     */
    to(): Object {
        return this.response;
    }

    stream(): any {
        const stream = {};
        for (const key in this.response) {
            const hitted = this.response[key];
            if (hitted && hitted.is) {
                stream[key] = hitted.to();
            }
        }
        return stream;
    }

    /**
     * 检查键值的最终render结果
     * @param mapping
     * @returns {StateOut}
     */
    ready(mapping: any = {}): boolean {
        let render = true;
        _zipper(this.state.out, mapping, (data: DataContainer) => {
            if (data) {
                render = render && data.is();
            }
        });
        return render;
    }
}

export default StateOut;
