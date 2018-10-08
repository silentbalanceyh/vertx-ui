import Ux from "ux";
import * as U from "underscore";

class RxAct {
    private reference: any;
    private data: any;
    private executor: any = {};
    private redux: any = {};
    private _deleted: Boolean = false;

    private constructor(reference: any) {
        this.reference = reference;
    }

    static from(reference: any) {
        return new RxAct(reference);
    }

    response(data: any) {
        this.data = data;
        return this;
    }

    close(fnClose) {
        const ref = this.executor;
        if (this.reference) {
            const {fnClose} = this.reference.props;
            if (fnClose) {
                ref["fnClose"] = fnClose;
            }
        }
        if (!ref.hasOwnProperty("fnClose") && U.isFunction(fnClose)) {
            ref["fnClose"] = fnClose;
        }
        return this;
    }

    clear() {
        if (this.reference) {
            const ref = this.executor;
            const {fnClear} = this.reference.props;
            if (fnClear) {
                ref["fnClear"] = fnClear;
            }
        }
        return this;
    }

    view(values: any) {
        if (this.reference) {
            const ref = this.executor;
            const {fnView} = this.reference.props;
            if (fnView) {
                if (values) {
                    ref["fnView"] = () => fnView(values);
                } else {
                    ref["fnView"] = () => fnView(this.data);
                }
            }
        }
        return this;
    }

    deleted() {
        this._deleted = true;
        return this;
    }

    json(data) {
        const $data = data ? data : this.data;
        Ux.dgFileJson($data);
        return this;
    }

    tree(values: any) {
        if (this.reference) {
            let treeData: any = {};
            if (values) {
                treeData = Ux.pipeTree(this.reference, values, this._deleted);
            } else if (this.data) {
                treeData = Ux.pipeTree(
                    this.reference,
                    this.data,
                    this._deleted
                );
            }
            this.redux["grid.tree"] = treeData;
        }
        return this;
    }

    submitted() {
        this.redux["status.submitting"] = false;
        return this;
    }

    query(filters: any = {}) {
        if (this.reference) {
            this.redux["grid.query"] = Ux.pipeQuery(this.reference, filters);
        }
        return this;
    }

    reset(fields: any) {
        const ref = this.reference;
        const executor = this.executor;
        executor["fnReset"] = event => {
            if (event && U.isFunction(event.preventDefault)) {
                event.preventDefault();
            }
            if (U.isArray(fields) && 0 < fields.length) {
                Ux.formReset(ref, fields);
            } else {
                Ux.formReset(ref);
            }
        };
        return this;
    }

    items(dataArray) {
        const ref = this.reference;
        const executor = this.executor;
        executor["fnItems"] = () => Ux.pipeReset(ref, dataArray);
        return this;
    }

    mount(key: any, value: any) {
        if (!this.redux) this.redux = {};
        this.redux[key] = value;
        return this;
    }

    to(callback) {
        // 是否包含执行方法
        const executor: any = this.executor;
        [
            "fnReset", // 重置表单专用函数
            "fnItems" // 重置list.items专用节点数据
        ]
            .filter(key => executor.hasOwnProperty(key))
            .forEach(item => executor[item]());
        // 是否有更新的状态
        if (this.reference) {
            // 专用处理状态中的提交
            // submitting = false
            this.reference.setState({
                submitting: false,
                $loading: false
            });
            // 有状态则书写Redux状态树
            if (!Ux.isEmpty(this.redux)) {
                Ux.writeTree(this.reference, this.redux);
            }
        }
        [
            "fnClear", // 清除数据专用函数
            "fnClose", // 关闭窗口、Tab页专用函数
            "fnView" // 从添加切换到编辑的专用函数
        ]
            .filter(key => executor.hasOwnProperty(key))
            .forEach(item => executor[item]());
        if (U.isFunction(callback)) {
            callback();
        }
    }
}

export default RxAct;
